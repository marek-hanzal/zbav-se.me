import { Effect } from "effect";
import { sql } from "kysely";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { SyncSkipErrorFx } from "../../error/SyncSkipErrorFx";
import { bundleItemOpenSyncFx } from "./bundleItemOpenSyncFx";
import { bundleLimitOpenSyncFx } from "./bundleLimitOpenSyncFx";

export namespace bundleOpenSyncFx {
	export interface Props {
		userId: string;
		/**
		 * Source application bundle configured in Stripe metadata.
		 *
		 * The source bundle is copied into a dedicated purchase bundle, so later changes
		 * to the user's default bundle never mutate historical Stripe purchases.
		 */
		bundle: string;
		/**
		 * Deterministic fulfillment key derived from Stripe object IDs.
		 *
		 * It is intentionally not a hash: the value should be readable in production
		 * when we need to explain why a purchase exists or was skipped.
		 */
		key: string;
		/**
		 * Stripe creation timestamp for the purchase source, not local processing time.
		 */
		createdAt: Date;
	}
}

/**
 * Materializes a one-off Stripe purchase as its own resource bundle.
 *
 * The important model decision is that one-off purchases do not mutate the user's
 * personal bundle. Each Stripe line item becomes a dedicated purchase bundle with
 * copied item/limit rows and a user_resource_bundle assignment. Rollback can then
 * expire that single assignment and kill exactly the resources created by the
 * purchase, without subtracting credits or guessing from current bundle config.
 */
export const bundleOpenSyncFx = Effect.fn("bundleOpenSyncFx")(function* ({
	userId,
	bundle,
	key,
	createdAt,
}: bundleOpenSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleOpenSyncFx");
	logger.trace("bundleOpenSyncFx", {
		userId,
		bundle,
		key,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			/*
			 * The mapping tables allow the same key to appear once per copied resource row,
			 * so a plain unique key constraint would be wrong. The advisory lock serializes
			 * processing for one Stripe fulfillment key before we check whether any copied
			 * row for that purchase already exists.
			 */
			yield* dbFx(async (kysely) => {
				return sql`select pg_advisory_xact_lock(hashtextextended(${key}, 0))`.execute(
					kysely,
				);
			});

			/**
			 * Check if the item/limit is already present.
			 */
			{
				const { item, limit } = yield* dbFx(async (kysely) => {
					const [item, limit] = await Promise.all([
						kysely
							.selectFrom("resource_bundle_item_stripe")
							.select([
								"id",
							])
							.where("key", "=", key)
							.executeTakeFirst(),
						kysely
							.selectFrom("resource_bundle_limit_stripe")
							.select([
								"id",
							])
							.where("key", "=", key)
							.executeTakeFirst(),
					]);

					return {
						item,
						limit,
					};
				});

				if (item || limit) {
					return yield* new SyncSkipErrorFx({
						message: "Stripe one-off purchase was already fulfilled",
						reason: "one-off already fulfilled",
						cause: {
							key,
						},
					});
				}
			}

			const resourceBundle = yield* dbFx(async (kysely) => {
				return kysely
					.selectFrom("resource_bundle")
					.selectAll()
					.where("name", "=", bundle)
					.executeTakeFirst();
			});

			if (!resourceBundle) {
				return yield* new SyncSkipErrorFx({
					message: "Stripe source resource bundle is missing",
					reason: "source bundle missing",
					cause: {
						bundle,
						key,
					},
				});
			}

			/*
			 * Fulfillment scope: create the purchase bundle, assign it to the user, then
			 * let item/limit syncs copy their concrete rows and Stripe mappings.
			 */
			{
				/*
				 * The bundle name is the Stripe fulfillment key. This gives support/debugging
				 * a direct path from a Stripe line item to the exact resource bundle visible in
				 * our database.
				 */
				const purchaseBundle = yield* dbFx(async (kysely) => {
					const inserted = await kysely
						.insertInto("resource_bundle")
						.values({
							id: genId(),
							name: key,
						})
						.onConflict((oc) => oc.column("name").doNothing())
						.returningAll()
						.executeTakeFirst();

					if (inserted) {
						return inserted;
					}

					return kysely
						.selectFrom("resource_bundle")
						.selectAll()
						.where("name", "=", key)
						.executeTakeFirstOrThrow();
				});

				yield* dbFx(async (kysely) => {
					return kysely
						.insertInto("user_resource_bundle")
						.values({
							id: genId(),
							userId,
							resourceBundleId: purchaseBundle.id,
							createdAt,
							availableAt: createdAt,
							expiresAt: null,
						})
						.onConflict((oc) => {
							return oc
								.columns([
									"userId",
									"resourceBundleId",
								])
								.doUpdateSet({
									availableAt: createdAt,
									expiresAt: null,
								});
						})
						.execute();
				});

				yield* bundleItemOpenSyncFx({
					sourceResourceBundleId: resourceBundle.id,
					purchaseResourceBundleId: purchaseBundle.id,
					key,
					createdAt,
				});
				yield* bundleLimitOpenSyncFx({
					sourceResourceBundleId: resourceBundle.id,
					purchaseResourceBundleId: purchaseBundle.id,
					key,
					createdAt,
				});

				return purchaseBundle;
			}
		}),
	);
});

export type bundleOpenSyncFx = ReturnType<typeof bundleOpenSyncFx>;

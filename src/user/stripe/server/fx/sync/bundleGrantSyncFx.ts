import { Effect } from "effect";
import { sql } from "kysely";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { ResourceBundleItemTableSchema } from "~/server/database/@table/ResourceBundleItemTableSchema";
import type { ResourceBundleLimitTableSchema } from "~/server/database/@table/ResourceBundleLimitTableSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { SyncSkippedFx } from "../../error/SyncSkippedFx";

export namespace bundleGrantSyncFx {
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
export const bundleGrantSyncFx = Effect.fn("bundleGrantSyncFx")(function* ({
	userId,
	bundle,
	key,
	createdAt,
}: bundleGrantSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleGrantSyncFx");
	logger.trace("bundleGrantSyncFx", {
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

			const existingStripeRows = yield* dbFx(async (kysely) => {
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

			if (existingStripeRows.item || existingStripeRows.limit) {
				return yield* new SyncSkippedFx({
					message: "Stripe one-off purchase was already fulfilled",
					reason: "one-off already fulfilled",
					cause: {
						key,
					},
				});
			}

			const sourceBundle = yield* dbFx(async (kysely) => {
				return kysely
					.selectFrom("resource_bundle")
					.selectAll()
					.where("name", "=", bundle)
					.executeTakeFirst();
			});

			if (!sourceBundle) {
				return yield* new SyncSkippedFx({
					message: "Stripe source resource bundle is missing",
					reason: "source bundle missing",
					cause: {
						bundle,
						key,
					},
				});
			}

			const [sourceItems, sourceLimits] = yield* dbFx(async (kysely) => {
				return Promise.all([
					kysely
						.selectFrom("resource_bundle_item")
						.selectAll()
						.where("resourceBundleId", "=", sourceBundle.id)
						.execute(),
					kysely
						.selectFrom("resource_bundle_limit")
						.selectAll()
						.where("resourceBundleId", "=", sourceBundle.id)
						.execute(),
				]);
			});

			if (sourceItems.length === 0 && sourceLimits.length === 0) {
				return yield* new SyncSkippedFx({
					message: "Stripe source resource bundle is empty",
					reason: "source bundle empty",
					cause: {
						bundle,
						key,
					},
				});
			}

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
					.onConflict((oc) =>
						oc
							.columns([
								"userId",
								"resourceBundleId",
							])
							.doUpdateSet({
								availableAt: createdAt,
								expiresAt: null,
							}),
					)
					.execute();
			});

			/*
			 * Copy the source bundle rows instead of referencing them. If product setup is
			 * adjusted later, already fulfilled purchases keep their concrete resources.
			 */
			const itemRows = yield* Effect.forEach(sourceItems, (sourceItem) =>
				dbFx(async (kysely): Promise<ResourceBundleItemTableSchema.Type> => {
					return kysely
						.insertInto("resource_bundle_item")
						.values({
							id: genId(),
							resourceBundleId: purchaseBundle.id,
							resourceDefinitionId: sourceItem.resourceDefinitionId,
							amount: sourceItem.amount,
							expiration: sourceItem.expiration,
						})
						.onConflict((oc) =>
							oc
								.columns([
									"resourceBundleId",
									"resourceDefinitionId",
								])
								.doUpdateSet({
									amount: sourceItem.amount,
									expiration: sourceItem.expiration,
								}),
						)
						.returningAll()
						.executeTakeFirstOrThrow();
				}),
			);
			const limitRows = yield* Effect.forEach(sourceLimits, (sourceLimit) =>
				dbFx(async (kysely): Promise<ResourceBundleLimitTableSchema.Type> => {
					return kysely
						.insertInto("resource_bundle_limit")
						.values({
							id: genId(),
							resourceBundleId: purchaseBundle.id,
							resourceDefinitionId: sourceLimit.resourceDefinitionId,
							limit: sourceLimit.limit,
						})
						.onConflict((oc) =>
							oc
								.columns([
									"resourceBundleId",
									"resourceDefinitionId",
								])
								.doUpdateSet({
									limit: sourceLimit.limit,
								}),
						)
						.returningAll()
						.executeTakeFirstOrThrow();
				}),
			);

			yield* Effect.forEach(itemRows, (itemRow) =>
				dbFx(async (kysely) => {
					return kysely
						.insertInto("resource_bundle_item_stripe")
						.values({
							id: genId(),
							resourceBundleItemId: itemRow.id,
							key,
							createdAt,
						})
						.onConflict((oc) =>
							oc
								.columns([
									"resourceBundleItemId",
									"key",
								])
								.doNothing(),
						)
						.execute();
				}),
			);
			yield* Effect.forEach(limitRows, (limitRow) =>
				dbFx(async (kysely) => {
					return kysely
						.insertInto("resource_bundle_limit_stripe")
						.values({
							id: genId(),
							resourceBundleLimitId: limitRow.id,
							key,
							createdAt,
						})
						.onConflict((oc) =>
							oc
								.columns([
									"resourceBundleLimitId",
									"key",
								])
								.doNothing(),
						)
						.execute();
				}),
			);

			return purchaseBundle;
		}),
	);
});

export type bundleGrantSyncFx = ReturnType<typeof bundleGrantSyncFx>;

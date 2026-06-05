import { Effect } from "effect";
import { sql } from "kysely";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace bundleCloseSyncFx {
	export interface Props {
		/**
		 * Deterministic Stripe fulfillment key used by the grant sync.
		 */
		key: string;
		/**
		 * Stripe event timestamp that invalidated the purchase.
		 */
		expiresAt: Date;
	}
}

/**
 * Expires all local resources created by one Stripe one-off purchase.
 *
 * The resource rows themselves do not carry expiresAt. The active/inactive switch is
 * the user_resource_bundle assignment, so rollback only needs to find the purchase
 * bundle through Stripe mapping rows and expire that assignment.
 */
export const bundleCloseSyncFx = Effect.fn("bundleCloseSyncFx")(function* ({
	key,
	expiresAt,
}: bundleCloseSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleCloseSyncFx");
	logger.trace("bundleCloseSyncFx", {
		key,
		expiresAt,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			/*
			 * Serialize with bundleOpenSyncFx for the same Stripe key. This prevents a
			 * refund and a delayed success event from interleaving halfway through the same
			 * purchase bundle.
			 */
			yield* dbFx(async (kysely) => {
				return sql`select pg_advisory_xact_lock(hashtextextended(${key}, 0))`.execute(
					kysely,
				);
			});

			const bundleIds = yield* dbFx(async (kysely) => {
				const [items, limits] = await Promise.all([
					kysely
						.selectFrom("resource_bundle_item_stripe as rbis")
						.innerJoin(
							"resource_bundle_item as rbi",
							"rbi.id",
							"rbis.resourceBundleItemId",
						)
						.select("rbi.resourceBundleId")
						.where("rbis.key", "=", key)
						.execute(),
					kysely
						.selectFrom("resource_bundle_limit_stripe as rbls")
						.innerJoin(
							"resource_bundle_limit as rbl",
							"rbl.id",
							"rbls.resourceBundleLimitId",
						)
						.select("rbl.resourceBundleId")
						.where("rbls.key", "=", key)
						.execute(),
				]);

				return [
					...new Set([
						...items.map((item) => item.resourceBundleId),
						...limits.map((item) => item.resourceBundleId),
					]),
				];
			});

			if (bundleIds.length === 0) {
				return yield* new NotFoundErrorFx({
					resource: "stripe-one-off-purchase-bundle",
					resourceId: key,
					message: "Stripe one-off purchase bundle is missing",
				});
			}

			yield* dbFx(async (kysely) => {
				return kysely
					.updateTable("user_resource_bundle")
					.set({
						expiresAt,
					})
					.where("resourceBundleId", "in", bundleIds)
					.execute();
			});

			return yield* Effect.void;
		}),
	);
});

export type bundleCloseSyncFx = ReturnType<typeof bundleCloseSyncFx>;

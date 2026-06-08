import { Effect } from "effect";
import { sql } from "kysely";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { bundleFeatureCloseSyncFx } from "./bundleFeatureCloseSyncFx";
import { bundleItemCloseSyncFx } from "./bundleItemCloseSyncFx";
import { bundleLimitCloseSyncFx } from "./bundleLimitCloseSyncFx";

export namespace bundleCloseSyncFx {
	export interface Props {
		/**
		 * Deterministic Stripe bundle key used by the grant sync.
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
 * Refund/rollback is a hard stop: expire the assignment and every user-facing
 * snapshot row created under it. Parent expiry is not implicit resource expiry,
 * so the child rows are updated deliberately here.
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

			const [items, limits, features] = yield* Effect.all([
				bundleItemCloseSyncFx({
					key,
				}),
				bundleLimitCloseSyncFx({
					key,
				}),
				bundleFeatureCloseSyncFx({
					key,
				}),
			]);
			const userResourceBundleIds = [
				...new Set([
					...items.map((item) => item.userResourceBundleId),
					...limits.map((limit) => limit.userResourceBundleId),
					...features.map((feature) => feature.userResourceBundleId),
				]),
			];

			if (userResourceBundleIds.length === 0) {
				return yield* new NotFoundErrorFx({
					resource: "stripe-one-off-purchase-bundle",
					resourceId: key,
					message: "Stripe one-off purchase bundle is missing",
				});
			}

			yield* dbFx(async (kysely) => {
				await kysely
					.updateTable("user_resource_bundle")
					.set({
						expiresAt,
					})
					.where("id", "in", userResourceBundleIds)
					.execute();

				await kysely
					.updateTable("user_resource_bundle_item")
					.set({
						expiresAt,
					})
					.where("userResourceBundleId", "in", userResourceBundleIds)
					.execute();

				await kysely
					.updateTable("user_resource_bundle_limit")
					.set({
						expiresAt,
					})
					.where("userResourceBundleId", "in", userResourceBundleIds)
					.execute();

				return kysely
					.updateTable("user_resource_bundle_feature")
					.set({
						expiresAt,
					})
					.where("userResourceBundleId", "in", userResourceBundleIds)
					.execute();
			});

			return yield* Effect.void;
		}),
	);
});

export type bundleCloseSyncFx = ReturnType<typeof bundleCloseSyncFx>;

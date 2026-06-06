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
			const bundleIds = [
				...new Set([
					...items.map((item) => item.resourceBundleId),
					...limits.map((limit) => limit.resourceBundleId),
					...features.map((feature) => feature.resourceBundleId),
				]),
			];

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

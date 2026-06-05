import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleItemCloseSyncFx {
	export interface Props {
		/**
		 * Deterministic Stripe fulfillment key used by the open sync.
		 */
		key: string;
	}
}

/**
 * Resolves purchase bundle IDs that were opened from item resources for one Stripe
 * fulfillment key.
 *
 * Close sync expires the user_resource_bundle assignment, not the copied item rows.
 * This Fx only maps Stripe item rows back to the owning purchase bundles.
 */
export const bundleItemCloseSyncFx = Effect.fn("bundleItemCloseSyncFx")(function* ({
	key,
}: bundleItemCloseSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleItemCloseSyncFx");
	logger.trace("bundleItemCloseSyncFx", {
		key,
	});

	return yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("resource_bundle_item_stripe as rbis")
			.innerJoin(
				"resource_bundle_item as rbi",
				"rbi.id",
				"rbis.resourceBundleItemId",
			)
			.select("rbi.resourceBundleId")
			.where("rbis.key", "=", key)
			.execute();
	});
});

export type bundleItemCloseSyncFx = ReturnType<typeof bundleItemCloseSyncFx>;

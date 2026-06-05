import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleLimitCloseSyncFx {
	export interface Props {
		/**
		 * Deterministic Stripe fulfillment key used by the open sync.
		 */
		key: string;
	}
}

/**
 * Resolves purchase bundle IDs that were opened from limit resources for one Stripe
 * fulfillment key.
 *
 * Close sync expires the user_resource_bundle assignment, not the copied limit rows.
 * This Fx only maps Stripe limit rows back to the owning purchase bundles.
 */
export const bundleLimitCloseSyncFx = Effect.fn("bundleLimitCloseSyncFx")(function* ({
	key,
}: bundleLimitCloseSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleLimitCloseSyncFx");
	logger.trace("bundleLimitCloseSyncFx", {
		key,
	});

	return yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("resource_bundle_limit_stripe as rbls")
			.innerJoin("resource_bundle_limit as rbl", "rbl.id", "rbls.resourceBundleLimitId")
			.select("rbl.resourceBundleId")
			.where("rbls.key", "=", key)
			.execute();
	});
});

export type bundleLimitCloseSyncFx = ReturnType<typeof bundleLimitCloseSyncFx>;

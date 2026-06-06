import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleFeatureCloseSyncFx {
	export interface Props {
		/**
		 * Deterministic Stripe bundle key used by the open sync.
		 */
		key: string;
	}
}

/**
 * Resolves purchase bundle IDs that were opened from feature resources for one Stripe
 * bundle key.
 */
export const bundleFeatureCloseSyncFx = Effect.fn("bundleFeatureCloseSyncFx")(function* ({
	key,
}: bundleFeatureCloseSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleFeatureCloseSyncFx");
	logger.trace("bundleFeatureCloseSyncFx", {
		key,
	});

	return yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("resource_bundle_feature_stripe as rbfs")
			.innerJoin("resource_bundle_feature as rbf", "rbf.id", "rbfs.resourceBundleFeatureId")
			.select("rbf.resourceBundleId")
			.where("rbfs.key", "=", key)
			.execute();
	});
});

export type bundleFeatureCloseSyncFx = ReturnType<typeof bundleFeatureCloseSyncFx>;

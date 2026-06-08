import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleFeatureCloseSyncFx {
	export interface Props {
		/** Deterministic Stripe bundle key used by the open sync. */
		key: string;
	}
}

/** Resolves user bundle assignments opened from feature resources for one Stripe key. */
export const bundleFeatureCloseSyncFx = Effect.fn("bundleFeatureCloseSyncFx")(function* ({
	key,
}: bundleFeatureCloseSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleFeatureCloseSyncFx");
	logger.trace("bundleFeatureCloseSyncFx", {
		key,
	});

	return yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("user_resource_bundle_feature_stripe as featureStripe")
			.innerJoin(
				"user_resource_bundle_feature as resourceFeature",
				"resourceFeature.id",
				"featureStripe.userResourceBundleFeatureId",
			)
			.select("resourceFeature.userResourceBundleId as assignmentId")
			.where("featureStripe.key", "=", key)
			.execute();
	});
});

export type bundleFeatureCloseSyncFx = ReturnType<typeof bundleFeatureCloseSyncFx>;

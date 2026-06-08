import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleFeatureOpenSyncFx {
	export interface Props {
		sourceResourceBundleId: string;
		userResourceBundleId: string;
		key: string;
		createdAt: Date;
	}
}

/**
 * Copies feature templates from the configured source bundle into one user-facing
 * Stripe purchase snapshot and records which copied rows came from the Stripe key.
 */
export const bundleFeatureOpenSyncFx = Effect.fn("bundleFeatureOpenSyncFx")(function* ({
	sourceResourceBundleId,
	userResourceBundleId,
	key,
	createdAt,
}: bundleFeatureOpenSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleFeatureOpenSyncFx");
	logger.trace("bundleFeatureOpenSyncFx", {
		sourceResourceBundleId,
		userResourceBundleId,
		key,
	});

	return yield* Effect.forEach(
		yield* dbFx(async (kysely) => {
			return kysely
				.selectFrom("resource_bundle_feature")
				.selectAll()
				.where("resourceBundleId", "=", sourceResourceBundleId)
				.execute();
		}),
		(sourceFeature) => {
			return dbFx(async (kysely) => {
				const feature = await kysely
					.insertInto("user_resource_bundle_feature")
					.values({
						id: genId(),
						userResourceBundleId,
						resourceDefinitionId: sourceFeature.resourceDefinitionId,
						createdAt,
						availableAt: createdAt,
						expiresAt: sourceFeature.expiresAt,
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				return kysely
					.insertInto("user_resource_bundle_feature_stripe")
					.values({
						id: genId(),
						userResourceBundleFeatureId: feature.id,
						key,
						createdAt,
					})
					.execute();
			});
		},
		{
			discard: true,
		},
	);
});

export type bundleFeatureOpenSyncFx = ReturnType<typeof bundleFeatureOpenSyncFx>;

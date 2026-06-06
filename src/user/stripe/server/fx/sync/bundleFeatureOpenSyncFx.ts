import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleFeatureOpenSyncFx {
	export interface Props {
		sourceResourceBundleId: string;
		purchaseResourceBundleId: string;
		key: string;
		createdAt: Date;
	}
}

/**
 * Copies feature resources from the configured source bundle into one Stripe purchase
 * bundle and records which copied rows came from the Stripe bundle key.
 */
export const bundleFeatureOpenSyncFx = Effect.fn("bundleFeatureOpenSyncFx")(function* ({
	sourceResourceBundleId,
	purchaseResourceBundleId,
	key,
	createdAt,
}: bundleFeatureOpenSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleFeatureOpenSyncFx");
	logger.trace("bundleFeatureOpenSyncFx", {
		sourceResourceBundleId,
		purchaseResourceBundleId,
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
					.insertInto("resource_bundle_feature")
					.values({
						id: genId(),
						resourceBundleId: purchaseResourceBundleId,
						resourceDefinitionId: sourceFeature.resourceDefinitionId,
					})
					.onConflict((oc) => {
						return oc
							.columns([
								"resourceBundleId",
								"resourceDefinitionId",
							])
							.doNothing();
					})
					.returningAll()
					.executeTakeFirst();

				const resourceBundleFeatureId =
					feature?.id ??
					(
						await kysely
							.selectFrom("resource_bundle_feature")
							.select("id")
							.where("resourceBundleId", "=", purchaseResourceBundleId)
							.where("resourceDefinitionId", "=", sourceFeature.resourceDefinitionId)
							.executeTakeFirstOrThrow()
					).id;

				return kysely
					.insertInto("resource_bundle_feature_stripe")
					.values({
						id: genId(),
						resourceBundleFeatureId,
						key,
						createdAt,
					})
					.onConflict((oc) => {
						return oc
							.columns([
								"resourceBundleFeatureId",
								"key",
							])
							.doNothing();
					})
					.execute();
			}).pipe(Effect.ignore);
		},
		{
			discard: true,
		},
	);
});

export type bundleFeatureOpenSyncFx = ReturnType<typeof bundleFeatureOpenSyncFx>;

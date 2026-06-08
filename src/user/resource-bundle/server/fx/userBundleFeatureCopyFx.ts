import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace userBundleFeatureCopyFx {
	export interface Props {
		/** Source resource_bundle template ID. */
		bundleId: string;
		/** Target user_resource_bundle ID. */
		assignmentId: string;
		createdAt: Date;
		availableAt: Date;
		/** undefined copies template expiry, null writes non-expiring rows. */
		expiresAt?: Date | null;
		/** Optional Stripe provenance key for copied rows. */
		stripeKey?: string;
	}
}

/** Copies feature rows from a bundle template into one user bundle snapshot. */
export const userBundleFeatureCopyFx = Effect.fn("userBundleFeatureCopyFx")(function* ({
	bundleId,
	assignmentId,
	createdAt,
	availableAt,
	expiresAt,
	stripeKey,
}: userBundleFeatureCopyFx.Props) {
	const logger = yield* getLoggerFx("userBundleFeatureCopyFx");
	logger.trace("userBundleFeatureCopyFx", {
		bundleId,
		assignmentId,
		stripeKey,
	});

	return yield* Effect.forEach(
		yield* dbFx(async (kysely) => {
			return kysely
				.selectFrom("resource_bundle_feature")
				.selectAll()
				.where("resourceBundleId", "=", bundleId)
				.execute();
		}),
		(feature) => {
			return dbFx(async (kysely) => {
				const row = await kysely
					.insertInto("user_resource_bundle_feature")
					.values({
						id: genId(),
						userResourceBundleId: assignmentId,
						resourceDefinitionId: feature.resourceDefinitionId,
						createdAt,
						availableAt,
						expiresAt: expiresAt === undefined ? feature.expiresAt : expiresAt,
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				if (!stripeKey) {
					return;
				}

				await kysely
					.insertInto("user_resource_bundle_feature_stripe")
					.values({
						id: genId(),
						userResourceBundleFeatureId: row.id,
						key: stripeKey,
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

export type userBundleFeatureCopyFx = ReturnType<typeof userBundleFeatureCopyFx>;

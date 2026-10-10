import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { genId } from "~/identity/fn/genId";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace userBundleFeatureCopyFx {
	export interface Props {
		/** Source resource_bundle template ID. */
		bundleId: string;
		/** Target user_resource_bundle ID. */
		assignmentId: string;
		createdAt: Date;
		availableAt: Date;
		/** Concrete snapshot expiration; null/undefined writes non-expiring rows. */
		expiresAt?: Date | null;
	}
}

/** Copies feature rows from a bundle template into one user bundle snapshot. */
export const userBundleFeatureCopyFx = Effect.fn("userBundleFeatureCopyFx")(function* ({
	bundleId,
	assignmentId,
	createdAt,
	availableAt,
	expiresAt,
}: userBundleFeatureCopyFx.Props) {
	const logger = yield* getLoggerFx("userBundleFeatureCopyFx");
	logger.trace("userBundleFeatureCopyFx", {
		bundleId,
		assignmentId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const features = yield* dbFx(async (kysely) => {
				return kysely
					.selectFrom("resource_bundle_feature")
					.selectAll()
					.where("resourceBundleId", "=", bundleId)
					.execute();
			});

			return yield* Effect.forEach(
				features,
				(feature) => {
					return dbFx(async (kysely) => {
						await kysely
							.insertInto("user_resource_bundle_feature")
							.values({
								id: genId(),
								userResourceBundleId: assignmentId,
								resourceDefinitionId: feature.resourceDefinitionId,
								createdAt,
								availableAt,
								expiresAt: expiresAt ?? null,
							})
							.execute();
					});
				},
				{
					discard: true,
				},
			);
		}),
	);
});

export type userBundleFeatureCopyFx = ReturnType<typeof userBundleFeatureCopyFx>;

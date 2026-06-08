import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace userBundleLimitCopyFx {
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

/** Copies limit rows from a bundle template into one user bundle snapshot. */
export const userBundleLimitCopyFx = Effect.fn("userBundleLimitCopyFx")(function* ({
	bundleId,
	assignmentId,
	createdAt,
	availableAt,
	expiresAt,
	stripeKey,
}: userBundleLimitCopyFx.Props) {
	const logger = yield* getLoggerFx("userBundleLimitCopyFx");
	logger.trace("userBundleLimitCopyFx", {
		bundleId,
		assignmentId,
		stripeKey,
	});

	return yield* Effect.forEach(
		yield* dbFx(async (kysely) => {
			return kysely
				.selectFrom("resource_bundle_limit")
				.selectAll()
				.where("resourceBundleId", "=", bundleId)
				.execute();
		}),
		(limit) => {
			return dbFx(async (kysely) => {
				const row = await kysely
					.insertInto("user_resource_bundle_limit")
					.values({
						id: genId(),
						userResourceBundleId: assignmentId,
						resourceDefinitionId: limit.resourceDefinitionId,
						limit: limit.limit,
						createdAt,
						availableAt,
						expiresAt: expiresAt === undefined ? limit.expiresAt : expiresAt,
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				if (!stripeKey) {
					return;
				}

				await kysely
					.insertInto("user_resource_bundle_limit_stripe")
					.values({
						id: genId(),
						userResourceBundleLimitId: row.id,
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

export type userBundleLimitCopyFx = ReturnType<typeof userBundleLimitCopyFx>;

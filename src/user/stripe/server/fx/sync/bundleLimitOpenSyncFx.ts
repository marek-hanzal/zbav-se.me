import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleLimitOpenSyncFx {
	export interface Props {
		sourceResourceBundleId: string;
		userResourceBundleId: string;
		key: string;
		createdAt: Date;
	}
}

/**
 * Copies limit templates from the configured source bundle into one user-facing
 * Stripe purchase snapshot and records which copied rows came from the Stripe key.
 */
export const bundleLimitOpenSyncFx = Effect.fn("bundleLimitOpenSyncFx")(function* ({
	sourceResourceBundleId,
	userResourceBundleId,
	key,
	createdAt,
}: bundleLimitOpenSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleLimitOpenSyncFx");
	logger.trace("bundleLimitOpenSyncFx", {
		sourceResourceBundleId,
		userResourceBundleId,
		key,
	});

	return yield* Effect.forEach(
		yield* dbFx(async (kysely) => {
			return kysely
				.selectFrom("resource_bundle_limit")
				.selectAll()
				.where("resourceBundleId", "=", sourceResourceBundleId)
				.execute();
		}),
		(sourceLimit) => {
			return dbFx(async (kysely) => {
				const limit = await kysely
					.insertInto("user_resource_bundle_limit")
					.values({
						id: genId(),
						userResourceBundleId,
						resourceDefinitionId: sourceLimit.resourceDefinitionId,
						limit: sourceLimit.limit,
						createdAt,
						availableAt: createdAt,
						expiresAt: sourceLimit.expiresAt,
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				return kysely
					.insertInto("user_resource_bundle_limit_stripe")
					.values({
						id: genId(),
						userResourceBundleLimitId: limit.id,
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

export type bundleLimitOpenSyncFx = ReturnType<typeof bundleLimitOpenSyncFx>;

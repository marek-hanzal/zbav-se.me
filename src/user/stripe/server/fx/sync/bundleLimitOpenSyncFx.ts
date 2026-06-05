import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleLimitOpenSyncFx {
	export interface Props {
		sourceResourceBundleId: string;
		purchaseResourceBundleId: string;
		key: string;
		createdAt: Date;
	}
}

/**
 * Copies limit resources from the configured source bundle into one Stripe purchase
 * bundle and records which copied rows came from the Stripe fulfillment key.
 *
 * Limits default to replace semantics in the resource model, so replaying this Fx
 * for the same purchase bundle updates the concrete copied limit row and leaves the
 * Stripe mapping idempotent.
 */
export const bundleLimitOpenSyncFx = Effect.fn("bundleLimitOpenSyncFx")(function* ({
	sourceResourceBundleId,
	purchaseResourceBundleId,
	key,
	createdAt,
}: bundleLimitOpenSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleLimitOpenSyncFx");
	logger.trace("bundleLimitOpenSyncFx", {
		sourceResourceBundleId,
		purchaseResourceBundleId,
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
					.insertInto("resource_bundle_limit")
					.values({
						id: genId(),
						resourceBundleId: purchaseResourceBundleId,
						resourceDefinitionId: sourceLimit.resourceDefinitionId,
						limit: sourceLimit.limit,
					})
					.onConflict((oc) =>
						oc
							.columns([
								"resourceBundleId",
								"resourceDefinitionId",
							])
							.doUpdateSet({
								limit: sourceLimit.limit,
							}),
					)
					.returningAll()
					.executeTakeFirstOrThrow();

				return kysely
					.insertInto("resource_bundle_limit_stripe")
					.values({
						id: genId(),
						resourceBundleLimitId: limit.id,
						key,
						createdAt,
					})
					.onConflict((oc) =>
						oc
							.columns([
								"resourceBundleLimitId",
								"key",
							])
							.doNothing(),
					)
					.execute();
                    /**
                     * Ignore all the errors
                     */
			}).pipe(Effect.ignore);
		},
		{
			discard: true,
		},
	);
});

export type bundleLimitOpenSyncFx = ReturnType<typeof bundleLimitOpenSyncFx>;

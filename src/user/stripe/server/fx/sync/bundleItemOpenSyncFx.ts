import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleItemOpenSyncFx {
	export interface Props {
		sourceResourceBundleId: string;
		purchaseResourceBundleId: string;
		key: string;
		createdAt: Date;
	}
}

/**
 * Copies item resources from the configured source bundle into one Stripe purchase
 * bundle and records which copied rows came from the Stripe bundle key.
 *
 * This Fx intentionally performs the source read inside the Effect.forEach input.
 * The source rows are only meaningful for this copy pass, so keeping the read next
 * to the write makes the one-off bundle path easier to audit.
 */
export const bundleItemOpenSyncFx = Effect.fn("bundleItemOpenSyncFx")(function* ({
	sourceResourceBundleId,
	purchaseResourceBundleId,
	key,
	createdAt,
}: bundleItemOpenSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleItemOpenSyncFx");
	logger.trace("bundleItemOpenSyncFx", {
		sourceResourceBundleId,
		purchaseResourceBundleId,
		key,
	});

	return yield* Effect.forEach(
		yield* dbFx(async (kysely) => {
			return kysely
				.selectFrom("resource_bundle_item")
				.selectAll()
				.where("resourceBundleId", "=", sourceResourceBundleId)
				.execute();
		}),
		(sourceItem) => {
			return dbFx(async (kysely) => {
				const item = await kysely
					.insertInto("resource_bundle_item")
					.values({
						id: genId(),
						resourceBundleId: purchaseResourceBundleId,
						resourceDefinitionId: sourceItem.resourceDefinitionId,
						amount: sourceItem.amount,
						expiresAt: sourceItem.expiresAt,
					})
					.onConflict((oc) => {
						return oc
							.columns([
								"resourceBundleId",
								"resourceDefinitionId",
							])
							.doUpdateSet({
								amount: sourceItem.amount,
								expiresAt: sourceItem.expiresAt,
							});
					})
					.returningAll()
					.executeTakeFirstOrThrow();

				return kysely
					.insertInto("resource_bundle_item_stripe")
					.values({
						id: genId(),
						resourceBundleItemId: item.id,
						key,
						createdAt,
					})
					.onConflict((oc) => {
						return oc
							.columns([
								"resourceBundleItemId",
								"key",
							])
							.doNothing();
					})
					.execute();
				/**
				 * Ignore all errors, keep going
				 */
			}).pipe(Effect.ignore);
		},
		{
			discard: true,
		},
	);
});

export type bundleItemOpenSyncFx = ReturnType<typeof bundleItemOpenSyncFx>;

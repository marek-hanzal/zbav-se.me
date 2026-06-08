import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleItemOpenSyncFx {
	export interface Props {
		sourceResourceBundleId: string;
		userResourceBundleId: string;
		key: string;
		createdAt: Date;
	}
}

/**
 * Copies item templates from the configured source bundle into one user-facing
 * Stripe purchase snapshot and records which copied rows came from the Stripe key.
 */
export const bundleItemOpenSyncFx = Effect.fn("bundleItemOpenSyncFx")(function* ({
	sourceResourceBundleId,
	userResourceBundleId,
	key,
	createdAt,
}: bundleItemOpenSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleItemOpenSyncFx");
	logger.trace("bundleItemOpenSyncFx", {
		sourceResourceBundleId,
		userResourceBundleId,
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
					.insertInto("user_resource_bundle_item")
					.values({
						id: genId(),
						userResourceBundleId,
						resourceDefinitionId: sourceItem.resourceDefinitionId,
						amount: sourceItem.amount,
						createdAt,
						availableAt: createdAt,
						expiresAt: sourceItem.expiresAt,
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				return kysely
					.insertInto("user_resource_bundle_item_stripe")
					.values({
						id: genId(),
						userResourceBundleItemId: item.id,
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

export type bundleItemOpenSyncFx = ReturnType<typeof bundleItemOpenSyncFx>;

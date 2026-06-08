import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace userBundleItemCopyFx {
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

/** Copies item rows from a bundle template into one user bundle snapshot. */
export const userBundleItemCopyFx = Effect.fn("userBundleItemCopyFx")(function* ({
	bundleId,
	assignmentId,
	createdAt,
	availableAt,
	expiresAt,
	stripeKey,
}: userBundleItemCopyFx.Props) {
	const logger = yield* getLoggerFx("userBundleItemCopyFx");
	logger.trace("userBundleItemCopyFx", {
		bundleId,
		assignmentId,
		stripeKey,
	});

	return yield* Effect.forEach(
		yield* dbFx(async (kysely) => {
			return kysely
				.selectFrom("resource_bundle_item")
				.selectAll()
				.where("resourceBundleId", "=", bundleId)
				.execute();
		}),
		(item) => {
			return dbFx(async (kysely) => {
				const row = await kysely
					.insertInto("user_resource_bundle_item")
					.values({
						id: genId(),
						userResourceBundleId: assignmentId,
						resourceDefinitionId: item.resourceDefinitionId,
						amount: item.amount,
						createdAt,
						availableAt,
						expiresAt: expiresAt === undefined ? item.expiresAt : expiresAt,
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				if (!stripeKey) {
					return;
				}

				await kysely
					.insertInto("user_resource_bundle_item_stripe")
					.values({
						id: genId(),
						userResourceBundleItemId: row.id,
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

export type userBundleItemCopyFx = ReturnType<typeof userBundleItemCopyFx>;

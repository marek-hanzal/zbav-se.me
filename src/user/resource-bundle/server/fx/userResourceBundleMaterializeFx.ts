import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace userResourceBundleMaterializeFx {
	export interface Props {
		/** Source template bundle copied into user-facing snapshot rows. */
		resourceBundleId: string;
		/** User assignment that owns the copied resource rows. */
		userResourceBundleId: string;
		/** Timestamp used for createdAt on copied rows. */
		createdAt: Date;
		/** Timestamp used for availableAt on copied rows. */
		availableAt: Date;
		/**
		 * Explicit expiration for limit rows.
		 *
		 * undefined means: copy the source template row expiration.
		 * null means: write a non-expiring user row explicitly.
		 */
		limitExpiresAt?: Date | null;
		/** See limitExpiresAt. */
		itemExpiresAt?: Date | null;
		/** See limitExpiresAt. */
		featureExpiresAt?: Date | null;
		/** Optional Stripe provenance key written next to each copied row. */
		stripeKey?: string;
	}
}

/**
 * Copies bundle template resources into user-facing snapshot rows.
 *
 * Template tables describe what a bundle currently means. User snapshot tables are
 * the authority for what one user actually has. This Fx copies template rows into
 * explicit user-owned rows at assignment/fulfillment time.
 */
export const userResourceBundleMaterializeFx = Effect.fn("userResourceBundleMaterializeFx")(
	function* ({
		resourceBundleId,
		userResourceBundleId,
		createdAt,
		availableAt,
		limitExpiresAt,
		itemExpiresAt,
		featureExpiresAt,
		stripeKey,
	}: userResourceBundleMaterializeFx.Props) {
		const logger = yield* getLoggerFx("userResourceBundleMaterializeFx");
		logger.trace("userResourceBundleMaterializeFx", {
			resourceBundleId,
			userResourceBundleId,
			stripeKey,
		});

		yield* dbFx(async (kysely) => {
			const [items, limits, features] = await Promise.all([
				kysely
					.selectFrom("resource_bundle_item")
					.selectAll()
					.where("resourceBundleId", "=", resourceBundleId)
					.execute(),
				kysely
					.selectFrom("resource_bundle_limit")
					.selectAll()
					.where("resourceBundleId", "=", resourceBundleId)
					.execute(),
				kysely
					.selectFrom("resource_bundle_feature")
					.selectAll()
					.where("resourceBundleId", "=", resourceBundleId)
					.execute(),
			]);

			for (const item of items) {
				const userItem = await kysely
					.insertInto("user_resource_bundle_item")
					.values({
						id: genId(),
						userResourceBundleId,
						resourceDefinitionId: item.resourceDefinitionId,
						amount: item.amount,
						createdAt,
						availableAt,
						expiresAt: itemExpiresAt === undefined ? item.expiresAt : itemExpiresAt,
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				if (stripeKey) {
					await kysely
						.insertInto("user_resource_bundle_item_stripe")
						.values({
							id: genId(),
							userResourceBundleItemId: userItem.id,
							key: stripeKey,
							createdAt,
						})
						.execute();
				}
			}

			for (const limit of limits) {
				const userLimit = await kysely
					.insertInto("user_resource_bundle_limit")
					.values({
						id: genId(),
						userResourceBundleId,
						resourceDefinitionId: limit.resourceDefinitionId,
						limit: limit.limit,
						createdAt,
						availableAt,
						expiresAt: limitExpiresAt === undefined ? limit.expiresAt : limitExpiresAt,
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				if (stripeKey) {
					await kysely
						.insertInto("user_resource_bundle_limit_stripe")
						.values({
							id: genId(),
							userResourceBundleLimitId: userLimit.id,
							key: stripeKey,
							createdAt,
						})
						.execute();
				}
			}

			for (const feature of features) {
				const userFeature = await kysely
					.insertInto("user_resource_bundle_feature")
					.values({
						id: genId(),
						userResourceBundleId,
						resourceDefinitionId: feature.resourceDefinitionId,
						createdAt,
						availableAt,
						expiresAt:
							featureExpiresAt === undefined ? feature.expiresAt : featureExpiresAt,
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				if (stripeKey) {
					await kysely
						.insertInto("user_resource_bundle_feature_stripe")
						.values({
							id: genId(),
							userResourceBundleFeatureId: userFeature.id,
							key: stripeKey,
							createdAt,
						})
						.execute();
				}
			}
		});
	},
);

export type userResourceBundleMaterializeFx = ReturnType<typeof userResourceBundleMaterializeFx>;

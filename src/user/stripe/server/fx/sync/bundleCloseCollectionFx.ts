import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleCloseCollectionFx {
	export interface Props {
		/** Deterministic Stripe bundle key used by the open sync. */
		key: string;
	}
}

/** Resolves all user bundle assignments opened from concrete resource rows for one Stripe key. */
export const bundleCloseCollectionFx = Effect.fn("bundleCloseCollectionFx")(function* ({
	key,
}: bundleCloseCollectionFx.Props) {
	const logger = yield* getLoggerFx("bundleCloseCollectionFx");
	logger.trace("bundleCloseCollectionFx", {
		key,
	});

	const rows = yield* dbFx(async (kysely) => {
		const [items, limits, features] = await Promise.all([
			kysely
				.selectFrom("user_resource_bundle_item_stripe as stripe")
				.innerJoin(
					"user_resource_bundle_item as resource",
					"resource.id",
					"stripe.userResourceBundleItemId",
				)
				.select("resource.userResourceBundleId as assignmentId")
				.where("stripe.key", "=", key)
				.execute(),
			kysely
				.selectFrom("user_resource_bundle_limit_stripe as stripe")
				.innerJoin(
					"user_resource_bundle_limit as resource",
					"resource.id",
					"stripe.userResourceBundleLimitId",
				)
				.select("resource.userResourceBundleId as assignmentId")
				.where("stripe.key", "=", key)
				.execute(),
			kysely
				.selectFrom("user_resource_bundle_feature_stripe as stripe")
				.innerJoin(
					"user_resource_bundle_feature as resource",
					"resource.id",
					"stripe.userResourceBundleFeatureId",
				)
				.select("resource.userResourceBundleId as assignmentId")
				.where("stripe.key", "=", key)
				.execute(),
		]);

		return [
			...items,
			...limits,
			...features,
		];
	});

	return [
		...new Set(rows.map((row) => row.assignmentId)),
	];
});

export type bundleCloseCollectionFx = ReturnType<typeof bundleCloseCollectionFx>;

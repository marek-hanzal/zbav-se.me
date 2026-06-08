import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundlePurchaseExistsFx {
	export interface Props {
		key: string;
	}
}

/** Checks whether a Stripe one-off bundle key already created any resource row. */
export const bundlePurchaseExistsFx = Effect.fn("bundlePurchaseExistsFx")(function* ({
	key,
}: bundlePurchaseExistsFx.Props) {
	const logger = yield* getLoggerFx("bundlePurchaseExistsFx");
	logger.trace("bundlePurchaseExistsFx", {
		key,
	});

	return yield* dbFx(async (kysely) => {
		const [item, limit, feature] = await Promise.all([
			kysely
				.selectFrom("user_resource_bundle_item_stripe")
				.select([
					"id",
				])
				.where("key", "=", key)
				.executeTakeFirst(),
			kysely
				.selectFrom("user_resource_bundle_limit_stripe")
				.select([
					"id",
				])
				.where("key", "=", key)
				.executeTakeFirst(),
			kysely
				.selectFrom("user_resource_bundle_feature_stripe")
				.select([
					"id",
				])
				.where("key", "=", key)
				.executeTakeFirst(),
		]);

		return Boolean(item || limit || feature);
	});
});

export type bundlePurchaseExistsFx = ReturnType<typeof bundlePurchaseExistsFx>;

import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleItemCloseSyncFx {
	export interface Props {
		/** Deterministic Stripe bundle key used by the open sync. */
		key: string;
	}
}

/** Resolves user bundle assignments opened from item resources for one Stripe key. */
export const bundleItemCloseSyncFx = Effect.fn("bundleItemCloseSyncFx")(function* ({
	key,
}: bundleItemCloseSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleItemCloseSyncFx");
	logger.trace("bundleItemCloseSyncFx", {
		key,
	});

	return yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("user_resource_bundle_item_stripe as urbis")
			.innerJoin(
				"user_resource_bundle_item as urbi",
				"urbi.id",
				"urbis.userResourceBundleItemId",
			)
			.select("urbi.userResourceBundleId")
			.where("urbis.key", "=", key)
			.execute();
	});
});

export type bundleItemCloseSyncFx = ReturnType<typeof bundleItemCloseSyncFx>;

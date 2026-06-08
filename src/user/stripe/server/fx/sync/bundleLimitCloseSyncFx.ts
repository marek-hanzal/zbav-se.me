import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleLimitCloseSyncFx {
	export interface Props {
		/** Deterministic Stripe bundle key used by the open sync. */
		key: string;
	}
}

/** Resolves user bundle assignments opened from limit resources for one Stripe key. */
export const bundleLimitCloseSyncFx = Effect.fn("bundleLimitCloseSyncFx")(function* ({
	key,
}: bundleLimitCloseSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleLimitCloseSyncFx");
	logger.trace("bundleLimitCloseSyncFx", {
		key,
	});

	return yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("user_resource_bundle_limit_stripe as urbls")
			.innerJoin(
				"user_resource_bundle_limit as urbl",
				"urbl.id",
				"urbls.userResourceBundleLimitId",
			)
			.select("urbl.userResourceBundleId")
			.where("urbls.key", "=", key)
			.execute();
	});
});

export type bundleLimitCloseSyncFx = ReturnType<typeof bundleLimitCloseSyncFx>;

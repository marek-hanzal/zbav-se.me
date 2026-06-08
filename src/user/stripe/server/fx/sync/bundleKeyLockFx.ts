import { Effect } from "effect";
import { sql } from "kysely";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace bundleKeyLockFx {
	export interface Props {
		key: string;
	}
}

/** Serializes Stripe one-off processing for one deterministic bundle key. */
export const bundleKeyLockFx = Effect.fn("bundleKeyLockFx")(function* ({
	key,
}: bundleKeyLockFx.Props) {
	const logger = yield* getLoggerFx("bundleKeyLockFx");
	logger.trace("bundleKeyLockFx", {
		key,
	});

	return yield* dbFx(async (kysely) => {
		return sql`select pg_advisory_xact_lock(hashtextextended(${key}, 0))`.execute(kysely);
	});
});

export type bundleKeyLockFx = ReturnType<typeof bundleKeyLockFx>;

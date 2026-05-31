import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withIgnoreSelectFx } from "~/buyer/ignore/server/db/withIgnoreSelectFx";
import type { IgnoreQuerySchema } from "~/buyer/ignore/server/schema/IgnoreQuerySchema";
import type { IgnoreWhereSchema } from "../schema/IgnoreWhereSchema";

export namespace ignoreFetchFx {
	export interface Props extends IgnoreQuerySchema.Type {
		scope: IgnoreWhereSchema.Type;
	}
}

export const ignoreFetchFx = Effect.fn("ignoreFetchFx")(function* ({
	where,
	scope,
	sort,
}: ignoreFetchFx.Props) {
	const logger = yield* getLoggerFx("ignoreFetchFx");
	logger.trace("ignoreFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "ignore",
		selectFx: withIgnoreSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type ignoreFetchFx = ReturnType<typeof ignoreFetchFx>;

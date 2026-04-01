import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withIgnoreQueryBuilderFx } from "~/buyer/ignore/server/db/withIgnoreQueryBuilderFx";
import { withIgnoreSelectFx } from "~/buyer/ignore/server/db/withIgnoreSelectFx";
import type { IgnoreFilterSchema } from "~/buyer/ignore/server/schema/IgnoreFilterSchema";
import type { IgnoreQuerySchema } from "~/buyer/ignore/server/schema/IgnoreQuerySchema";

export namespace ignoreFetchFx {
	export interface Props extends IgnoreQuerySchema.Type {
		scope: IgnoreFilterSchema.Type;
	}
}

export const ignoreFetchFx = Effect.fn("ignoreFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: ignoreFetchFx.Props) {
	const logger = yield* getLoggerFx("ignoreFetchFx");
	logger.debug("ignoreFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "ignore",
		selectFx: withIgnoreSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withIgnoreQueryBuilderFx,
	});
});

export type ignoreFetchFx = ReturnType<typeof ignoreFetchFx>;

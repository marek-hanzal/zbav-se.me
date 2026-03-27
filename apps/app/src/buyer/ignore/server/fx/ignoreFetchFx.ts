import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
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

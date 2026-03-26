import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withIgnoreQueryBuilderFx } from "~/server/@buyer/ignore/db/withIgnoreQueryBuilderFx";
import { withIgnoreSelectFx } from "~/server/@buyer/ignore/db/withIgnoreSelectFx";
import type { IgnoreFilterSchema } from "~/server/@buyer/ignore/schema/IgnoreFilterSchema";
import type { IgnoreQuerySchema } from "~/server/@buyer/ignore/schema/IgnoreQuerySchema";

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

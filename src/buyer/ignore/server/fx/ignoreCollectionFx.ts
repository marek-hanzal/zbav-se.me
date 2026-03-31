import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { withIgnoreCollectionSelectFx } from "~/buyer/ignore/server/db/withIgnoreCollectionSelectFx";
import { withIgnoreQueryBuilderFx } from "~/buyer/ignore/server/db/withIgnoreQueryBuilderFx";
import type { IgnoreFilterSchema } from "~/buyer/ignore/server/schema/IgnoreFilterSchema";
import type { IgnoreQuerySchema } from "~/buyer/ignore/server/schema/IgnoreQuerySchema";

export namespace ignoreCollectionFx {
	export interface Props extends IgnoreQuerySchema.Type {
		scope: IgnoreFilterSchema.Type;
	}
}

export const ignoreCollectionFx = Effect.fn("ignoreCollectionFx")(function* ({
	filter,
	where,
	scope,
	sort,
	cursor,
}: ignoreCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withIgnoreCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withIgnoreQueryBuilderFx,
	});
});

export type ignoreCollectionFx = ReturnType<typeof ignoreCollectionFx>;

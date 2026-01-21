import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withIgnoreCollectionSelectFx } from "~/app/ignore/db/withIgnoreCollectionSelectFx";
import { withIgnoreQueryBuilderFx } from "~/app/ignore/db/withIgnoreQueryBuilderFx";
import type { IgnoreFilterSchema } from "~/app/ignore/schema/IgnoreFilterSchema";
import type { IgnoreQuerySchema } from "~/app/ignore/schema/IgnoreQuerySchema";

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

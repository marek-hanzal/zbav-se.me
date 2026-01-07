import { withCollectionFx } from "@use-pico/common/collection";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withIgnoreQueryBuilderFx } from "~/app/ignore/db/withIgnoreQueryBuilderFx";
import { withIgnoreSelectFx } from "~/app/ignore/db/withIgnoreSelectFx";
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
		selectFx: withIgnoreSelectFx({
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


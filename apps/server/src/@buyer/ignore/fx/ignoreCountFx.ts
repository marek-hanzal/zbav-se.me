import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withIgnoreCollectionSelectFx } from "~/@buyer/ignore/db/withIgnoreCollectionSelectFx";
import { withIgnoreQueryBuilderFx } from "~/@buyer/ignore/db/withIgnoreQueryBuilderFx";
import type { IgnoreCountQuerySchema } from "~/@buyer/ignore/schema/IgnoreCountQuerySchema";
import type { IgnoreFilterSchema } from "~/@buyer/ignore/schema/IgnoreFilterSchema";

export namespace ignoreCountFx {
	export interface Props extends IgnoreCountQuerySchema.Type {
		scope: IgnoreFilterSchema.Type;
	}
}

export const ignoreCountFx = Effect.fn("ignoreCountFx")(function* ({
	filter,
	where,
	scope,
}: ignoreCountFx.Props) {
	return yield* withCountFx({
		selectFx: withIgnoreCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withIgnoreQueryBuilderFx,
	});
});

export type ignoreCountFx = ReturnType<typeof ignoreCountFx>;

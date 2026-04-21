import { Effect } from "effect";
import { withCategorySourceSelectFx } from "~/public/category/server/db/withCategorySourceSelectFx";

export namespace withCategorySelectFx {
	export interface Props extends withCategorySourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withCategorySelectFx>>;
}

export const withCategorySelectFx = Effect.fn("withCategorySelectFx")(function* ({
	sort,
}: withCategorySelectFx.Props) {
	const sourceSelect = yield* withCategorySourceSelectFx({
		sort,
	});

	return sourceSelect.selectAll("cat");
});

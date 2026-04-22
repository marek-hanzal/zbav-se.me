import { Effect } from "effect";
import { withCategorySourceSelectFx } from "~/user/category/server/db/withCategorySourceSelectFx";

export namespace withCategorySelectFx {
	export interface Props extends withCategorySourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withCategorySelectFx>>;
}

export const withCategorySelectFx = Effect.fn("withCategorySelectFx")(function* (
	props: withCategorySelectFx.Props,
) {
	const sourceSelect = yield* withCategorySourceSelectFx(props);

	return sourceSelect.selectAll("cat");
});

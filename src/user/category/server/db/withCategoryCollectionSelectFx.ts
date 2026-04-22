import { Effect } from "effect";
import { withCategorySourceSelectFx } from "~/user/category/server/db/withCategorySourceSelectFx";

export namespace withCategoryCollectionSelectFx {
	export interface Props extends withCategorySourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withCategoryCollectionSelectFx>>;
}

export const withCategoryCollectionSelectFx = Effect.fn("withCategoryCollectionSelectFx")(
	function* (props: withCategoryCollectionSelectFx.Props) {
		const sourceSelect = yield* withCategorySourceSelectFx(props);

		return sourceSelect.selectAll("cat");
	},
);

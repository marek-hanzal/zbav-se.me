import { Effect } from "effect";
import { withCategorySourceSelectFx } from "~/public/category/server/db/withCategorySourceSelectFx";

export namespace withCategoryCollectionSelectFx {
	export interface Props extends withCategorySourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withCategoryCollectionSelectFx>>;
}

export const withCategoryCollectionSelectFx = Effect.fn("withCategoryCollectionSelectFx")(
	function* ({ sort }: withCategoryCollectionSelectFx.Props) {
		const sourceSelect = yield* withCategorySourceSelectFx({
			sort,
		});

		return sourceSelect.selectAll("cat");
	},
);

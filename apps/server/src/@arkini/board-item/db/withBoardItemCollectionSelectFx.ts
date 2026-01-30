import { Effect } from "effect";
import { withBoardItemSourceSelectFx } from "~/@arkini/board-item/db/withBoardItemSourceSelectFx";

export namespace withBoardItemCollectionSelectFx {
	export interface Props extends withBoardItemSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withBoardItemCollectionSelectFx>>;
}

export const withBoardItemCollectionSelectFx = Effect.fn("withBoardItemCollectionSelectFx")(
	function* ({ sort }: withBoardItemCollectionSelectFx.Props) {
		const sourceSelect = yield* withBoardItemSourceSelectFx({
			sort,
		});

		return sourceSelect.selectAll("bi");
	},
);

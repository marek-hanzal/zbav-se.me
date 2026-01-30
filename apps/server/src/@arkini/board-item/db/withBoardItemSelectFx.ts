import { Effect } from "effect";
import { withBoardItemSourceSelectFx } from "~/@arkini/board-item/db/withBoardItemSourceSelectFx";

export namespace withBoardItemSelectFx {
	export interface Props extends withBoardItemSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withBoardItemSelectFx>>;
}

export const withBoardItemSelectFx = Effect.fn("withBoardItemSelectFx")(function* ({
	sort,
}: withBoardItemSelectFx.Props) {
	const sourceSelect = yield* withBoardItemSourceSelectFx({
		sort,
	});

	return sourceSelect.selectAll("bi");
});

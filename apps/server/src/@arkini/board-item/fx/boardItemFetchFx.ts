import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withBoardItemQueryBuilderFx } from "~/@arkini/board-item/db/withBoardItemQueryBuilderFx";
import { withBoardItemSelectFx } from "~/@arkini/board-item/db/withBoardItemSelectFx";
import type { BoardItemFilterSchema } from "~/@arkini/board-item/schema/BoardItemFilterSchema";
import type { BoardItemQuerySchema } from "~/@arkini/board-item/schema/BoardItemQuerySchema";

export namespace boardItemFetchFx {
	export interface Props extends BoardItemQuerySchema.Type {
		scope: BoardItemFilterSchema.Type;
	}
}

export const boardItemFetchFx = Effect.fn("boardItemFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: boardItemFetchFx.Props) {
	return yield* withFetchFx({
		resource: "board-item",
		selectFx: withBoardItemSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withBoardItemQueryBuilderFx,
	});
});

import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withBoardItemCollectionSelectFx } from "~/@arkini/board-item/db/withBoardItemCollectionSelectFx";
import { withBoardItemQueryBuilderFx } from "~/@arkini/board-item/db/withBoardItemQueryBuilderFx";
import type { BoardItemFilterSchema } from "~/@arkini/board-item/schema/BoardItemFilterSchema";
import type { BoardItemQuerySchema } from "~/@arkini/board-item/schema/BoardItemQuerySchema";

export namespace boardItemCollectionFx {
	export interface Props extends BoardItemQuerySchema.Type {
		scope: BoardItemFilterSchema.Type;
	}
}

export const boardItemCollectionFx = Effect.fn("boardItemCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor,
	sort,
}: boardItemCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withBoardItemCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 512,
		},
		filter,
		where,
		scope,
		queryFx: withBoardItemQueryBuilderFx,
	});
});

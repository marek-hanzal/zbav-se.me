import { Effect } from "effect";
import { match } from "ts-pattern";
import type { BoardItemSortSchema } from "~/@arkini/board-item/schema/BoardItemSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withBoardItemSourceSelectFx {
	export interface Props {
		sort?: BoardItemSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withBoardItemSourceSelectFx>>;
}

export const withBoardItemSourceSelectFx = Effect.fn("withBoardItemSourceSelectFx")(function* ({
	sort = [],
}: withBoardItemSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("board_item as bi").innerJoin("board as b", "b.id", "bi.boardId");

	for (const item of sort) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("bi.createdAt", item.direction))
			.with("level", () => query.orderBy("bi.level", item.direction))
			.with("x", () => query.orderBy("bi.x", item.direction))
			.with("y", () => query.orderBy("bi.y", item.direction))
			.exhaustive();
	}

	return query;
});

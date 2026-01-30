import { Effect } from "effect";
import { boardGetFx } from "~/@arkini/board/fx/boardGetFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace boardItemsFx {
	export interface Props {
		userId: string;
	}
}

export const boardItemsFx = Effect.fn("boardItemsFx")(function* ({ userId }: boardItemsFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const board = yield* boardGetFx({
		userId,
	});

	return yield* Effect.promise(() =>
		kysely
			.selectFrom("board_item")
			.selectAll()
			.where("boardId", "=", board.id)
			.orderBy("createdAt", "asc")
			.execute(),
	);
});

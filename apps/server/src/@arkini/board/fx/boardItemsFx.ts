import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace boardItemsFx {
	export interface Props {
		userId: string;
	}
}

export const boardItemsFx = Effect.fn("boardItemsFx")(function* ({ userId }: boardItemsFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	const rows = yield* Effect.promise(async () => {
		return kysely
			.selectFrom("board_item as bi")
			.innerJoin("board as b", "b.id", "bi.boardId")
			.where("b.userId", "=", userId)
			.selectAll("bi")
			.orderBy("bi.createdAt", "asc")
			.execute();
	});

	return rows;
});

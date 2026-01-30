import { NotFoundErrorFx } from "@use-pico/common/error";
import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace boardGetFx {
	export interface Props {
		userId: string;
	}
}

export const boardGetFx = Effect.fn("boardGetFx")(function* ({ userId }: boardGetFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	const board = yield* Effect.promise(() =>
		kysely
			.selectFrom("board")
			.selectAll()
			.where("userId", "=", userId)
			.orderBy("createdAt", "asc")
			.limit(1)
			.executeTakeFirst(),
	);

	if (!board) {
		return yield* new NotFoundErrorFx({
			resource: "board",
			resourceId: userId,
			message: "Board not found",
		});
	}

	return board;
});

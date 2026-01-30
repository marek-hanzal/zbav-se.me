import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { boardGetFx } from "~/@arkini/board/fx/boardGetFx";
import { boardItemsFx } from "~/@arkini/board/fx/boardItemsFx";
import type { BoardItemSchema } from "~/@arkini/board/schema/BoardItemSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace boardSaveFx {
	export interface Props {
		userId: string;
		items: BoardItemSchema.Type[];
	}
}

export const boardSaveFx = Effect.fn("boardSaveFx")(function* ({
	userId,
	items,
}: boardSaveFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const board = yield* boardGetFx({
				userId,
			});

			const now = dateContext.now();

			yield* Effect.promise(() =>
				kysely.deleteFrom("board_item").where("boardId", "=", board.id).execute(),
			);

			if (items.length > 0) {
				yield* Effect.promise(() =>
					kysely
						.insertInto("board_item")
						.values(
							items.map((item) => ({
								...item,
								id: genId(),
								boardId: board.id,
								createdAt: now.toJSDate(),
							})),
						)
						.execute(),
				);
			}

			return yield* boardItemsFx({
				userId,
			});
		}),
	);
});

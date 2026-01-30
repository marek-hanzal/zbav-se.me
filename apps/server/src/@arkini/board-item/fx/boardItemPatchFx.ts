import { Effect } from "effect";
import { boardItemFetchFx } from "~/@arkini/board-item/fx/boardItemFetchFx";
import type { BoardItemFilterSchema } from "~/@arkini/board-item/schema/BoardItemFilterSchema";
import type { BoardItemPatchSchema } from "~/@arkini/board-item/schema/BoardItemPatchSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace boardItemPatchFx {
	export interface Props extends BoardItemPatchSchema.Type {
		scope: BoardItemFilterSchema.Type;
	}
}

export const boardItemPatchFx = Effect.fn("boardItemPatchFx")(function* ({
	patch,
	query,
	scope,
}: boardItemPatchFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const item = yield* boardItemFetchFx({
				...query,
				scope,
			});

			yield* Effect.promise(() =>
				kysely
					.updateTable("board_item")
					.set(patch)
					.where("id", "=", item.id)
					.executeTakeFirst(),
			);

			return yield* boardItemFetchFx({
				where: {
					id: item.id,
				},
				scope,
			});
		}),
	);
});

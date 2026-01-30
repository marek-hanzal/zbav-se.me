import { Effect } from "effect";
import type { withBoardItemSourceSelectFx } from "~/@arkini/board-item/db/withBoardItemSourceSelectFx";
import type { BoardItemFilterSchema } from "~/@arkini/board-item/schema/BoardItemFilterSchema";

export namespace withBoardItemQueryBuilderFx {
	export interface Props<
		TSelect extends withBoardItemSourceSelectFx.Select = withBoardItemSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: BoardItemFilterSchema.Type;
	}

	export type Callback = <TSelect extends withBoardItemSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withBoardItemQueryBuilderFx = Effect.fn("withBoardItemQueryBuilderFx")(function* <
	TSelect extends withBoardItemSourceSelectFx.Select,
>({ select, where }: withBoardItemQueryBuilderFx.Props<TSelect>) {
	if (!where) {
		return yield* Effect.succeed(select);
	}

	let query = select;

	if (where.id) {
		query = query.where("bi.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("bi.id", "in", where.idIn) as TSelect;
	}

	if (where.userId) {
		query = query.where("b.userId", "=", where.userId) as TSelect;
	}

	return yield* Effect.succeed(query);
});

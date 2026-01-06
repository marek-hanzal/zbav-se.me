import { Effect } from "effect";
import type { SelectQueryBuilder } from "kysely";
import type { CursorSchema } from "../schema/CursorSchema";
import type { FilterSchema } from "../schema/FilterSchema";

export namespace withListFx {
	export namespace Query {
		export interface Props<
			TSelect extends SelectQueryBuilder<any, any, any>,
			TFilter extends FilterSchema.Type,
		> {
			select: TSelect;
			where?: TFilter;
		}
	}

	export interface Props<
		TDB,
		TTable extends keyof TDB,
		TOutput,
		TFilter extends FilterSchema.Type,
		TSelectError,
		TSelectContext,
		TQueryError,
		TQueryContext,
	> {
		selectFx: Effect.Effect<
			SelectQueryBuilder<TDB, TTable, TOutput>,
			TSelectError,
			TSelectContext
		>;
		queryFx?(
			props: Query.Props<SelectQueryBuilder<TDB, TTable, TOutput>, TFilter>,
		): Effect.Effect<SelectQueryBuilder<TDB, TTable, TOutput>, TQueryError, TQueryContext>;

		filter?: TFilter;
		where?: TFilter;
		cursor?: CursorSchema.Type;
	}
}

export const withListFx = Effect.fn("withListFx")(function* <
	const TDB,
	const TTable extends keyof TDB,
	const TOutput,
	const TFilter extends FilterSchema.Type,
	const TSelectError,
	const TSelectContext,
	const TQueryError,
	const TQueryContext,
>({
	selectFx,
	queryFx = () =>
		selectFx as unknown as Effect.Effect<
			SelectQueryBuilder<TDB, TTable, TOutput>,
			TQueryError,
			TQueryContext
		>,
	filter,
	where,
	cursor,
}: withListFx.Props<
	TDB,
	TTable,
	TOutput,
	TFilter,
	TSelectError,
	TSelectContext,
	TQueryError,
	TQueryContext
>) {
	const select = yield* selectFx;

	const limit = (select: SelectQueryBuilder<TDB, TTable, TOutput>) => {
		let $select = select;

		if (cursor) {
			$select = select.limit(cursor.size).offset(cursor.page * cursor.size);
		}

		return $select;
	};

	const whereSelect = yield* queryFx({
		select,
		where,
	});
	const filterSelect = yield* queryFx({
		select: whereSelect,
		where: filter,
	});

	return yield* Effect.promise(async () => {
		return limit(filterSelect).execute();
	});
});

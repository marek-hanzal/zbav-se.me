import { Effect } from "effect";
import type { SelectQueryBuilder, Simplify } from "kysely";
import type z from "zod";
import type { CursorSchema } from "../schema/CursorSchema";
import type { FilterSchema } from "../schema/FilterSchema";

export namespace withCollectionFx {
	export type Output<TOutputSchema extends z.ZodSchema> = Simplify<z.infer<TOutputSchema>>;

	export interface Result<TOutput> {
		data: TOutput[];
		more: boolean;
	}

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
		cursor: CursorSchema.Type;
	}
}

export const withCollectionFx = Effect.fn("withCollectionFx")(function* <
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
}: withCollectionFx.Props<
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

	const whereSelect = yield* queryFx({
		select,
		where,
	});
	const filterSelect = yield* queryFx({
		select: whereSelect,
		where: filter,
	});

	const results = yield* Effect.promise(async () => {
		return filterSelect
			.limit(cursor.size + 1)
			.offset(cursor.page * cursor.size)
			.execute();
	});

	return {
		data: results.slice(0, cursor.size),
		more: results.length > cursor.size,
	};
});

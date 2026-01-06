import { Effect } from "effect";
import type { SelectQueryBuilder } from "kysely";
import { NotFoundErrorFx } from "../error/NotFoundErrorFx";
import type { FilterSchema } from "../schema/FilterSchema";

export namespace withFetchFx {
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
		resource: string;
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
	}
}

export const withFetchFx = Effect.fn("withFetchFx")(function* <
	const TDB,
	const TTable extends keyof TDB,
	const TOutput,
	const TFilter extends FilterSchema.Type,
	const TSelectError,
	const TSelectContext,
	const TQueryError,
	const TQueryContext,
>({
	resource,
	selectFx,
	queryFx = () =>
		selectFx as unknown as Effect.Effect<
			SelectQueryBuilder<TDB, TTable, TOutput>,
			TQueryError,
			TQueryContext
		>,
	filter,
	where,
}: withFetchFx.Props<
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

	const result = yield* Effect.promise(async () => {
		return filterSelect.executeTakeFirst();
	});

	if (!result) {
		return yield* new NotFoundErrorFx({
			resource,
			resourceId: JSON.stringify({
				filter,
				where,
			}),
			message: "Resource not found",
		});
	}

	return result;
});

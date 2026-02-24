import { Effect } from "effect";
import type { SelectQueryBuilder } from "kysely";
import type { FilterSchema } from "../schema/FilterSchema";

export namespace withCountFx {
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
		TSelect extends SelectQueryBuilder<any, any, any>,
		TFilter extends FilterSchema.Type,
		TSelectError,
		TSelectContext,
		TQueryError,
		TQueryContext,
	> {
		selectFx: Effect.Effect<TSelect, TSelectError, TSelectContext>;
		queryFx?(
			props: Query.Props<TSelect, TFilter>,
		): Effect.Effect<TSelect, TQueryError, TQueryContext>;
		//
		filter?: TFilter;
		where?: TFilter;
		scope?: TFilter;
	}
}

export const withCountFx = Effect.fn("withCountFx")(function* <
	const TSelect extends SelectQueryBuilder<any, any, any>,
	const TFilter extends FilterSchema.Type,
	const TSelectError,
	const TSelectContext,
	const TQueryError,
	const TQueryContext,
>({
	selectFx,
	queryFx = ({ select }) => Effect.succeed(select),
	filter,
	where,
	scope,
}: withCountFx.Props<TSelect, TFilter, TSelectError, TSelectContext, TQueryError, TQueryContext>) {
	const select = yield* selectFx;

	const scopeSelect = yield* queryFx({
		select,
		where: scope,
	});

	const whereSelect = yield* queryFx({
		select: yield* queryFx({
			select,
			where,
		}),
		where: scope,
	});

	const filterSelect = yield* queryFx({
		select: yield* queryFx({
			select: yield* queryFx({
				select,
				where: filter,
			}),
			where,
		}),
		where: scope,
	});

	const countTotal = yield* Effect.promise(async () => {
		return scopeSelect
			.clearSelect()
			.select((eb) => eb.fn.countAll<number>().as("count"))
			.executeTakeFirstOrThrow();
	});

	const countFilter = yield* Effect.promise(async () => {
		return filterSelect
			.clearSelect()
			.select((eb) => eb.fn.countAll<number>().as("count"))
			.executeTakeFirstOrThrow();
	});

	const countWhere = yield* Effect.promise(async () => {
		return whereSelect
			.clearSelect()
			.select((eb) => eb.fn.countAll<number>().as("count"))
			.executeTakeFirstOrThrow();
	});

	const total = countTotal.count;
	const filterCount = countFilter.count;
	const whereCount = countWhere.count;

	return {
		total,
		filter: filterCount,
		where: whereCount,
		isEmpty: total === 0,
		isFilterEmpty: filterCount === 0 && total > 0,
	};
});

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

	const hasFilter = !!(filter && Object.keys(filter).length > 0);
	const hasWhere = !!(where && Object.keys(where).length > 0);
	const countAll = !hasFilter && !hasWhere;

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

	const countFilter = countAll
		? countTotal
		: yield* Effect.promise(async () => {
				return filterSelect
					.clearSelect()
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.executeTakeFirstOrThrow();
			});

	const countWhere = countAll
		? countTotal
		: yield* Effect.promise(async () => {
				return whereSelect
					.clearSelect()
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.executeTakeFirstOrThrow();
			});

	const total = Number(countTotal.count);
	const filterCount = Number(countFilter.count);
	const whereCount = Number(countWhere.count);

	return {
		total,
		filter: filterCount,
		where: whereCount,
		isEmpty: total === 0,
		isFilterEmpty: filterCount === 0 && total > 0,
	};
});

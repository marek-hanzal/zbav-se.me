import { Effect } from "effect";
import type { SelectQueryBuilder } from "kysely";
import { zodFx } from "../schema";
import { CountSchema } from "../schema/CountSchema";
import type { FilterSchema } from "../schema/FilterSchema";

export namespace withCountFx {
	export type Count = "total" | "filter" | "where";

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

		filter?: TFilter;
		where?: TFilter;
		count?: Count[];
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
	queryFx = () => selectFx as unknown as Effect.Effect<TSelect, TQueryError, TQueryContext>,
	filter,
	where,
	count = [
		"total",
		"filter",
		"where",
	],
}: withCountFx.Props<TSelect, TFilter, TSelectError, TSelectContext, TQueryError, TQueryContext>) {
	const select = yield* selectFx;
	const whereSelect = yield* queryFx({
		select,
		where,
	});
	const filterSelect = yield* queryFx({
		select: whereSelect,
		where: filter,
	});

	const countTotal = count.includes("total")
		? yield* Effect.promise(async () => {
				return select
					.clearSelect()
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.executeTakeFirstOrThrow();
			})
		: {
				count: 0,
			};
	const countFilter = count.includes("filter")
		? yield* Effect.promise(async () => {
				return filterSelect
					.clearSelect()
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.executeTakeFirstOrThrow();
			})
		: {
				count: 0,
			};
	const countWhere = count.includes("where")
		? yield* Effect.promise(async () => {
				return whereSelect
					.clearSelect()
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.executeTakeFirstOrThrow();
			})
		: {
				count: 0,
			};

	return yield* zodFx({
		schema: CountSchema,
		data: {
			total: countTotal.count,
			filter: countFilter.count,
			where: countWhere.count,
		},
	});
});

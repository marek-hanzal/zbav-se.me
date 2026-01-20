import { Effect } from "effect";
import type { SelectQueryBuilder } from "kysely";
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
		//
		filter?: TFilter;
		where?: TFilter;
		scope?: TFilter;
		//
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
	queryFx = ({ select }) => Effect.succeed(select),
	filter,
	where,
	scope,
	count = [
		"total",
		"filter",
		"where",
	],
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

	const countTotal = count.includes("total")
		? yield* Effect.promise(async () => {
				return scopeSelect
					.clearSelect()
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.executeTakeFirstOrThrow();
			})
		: undefined;

	const countFilter = count.includes("filter")
		? yield* Effect.promise(async () => {
				return filterSelect
					.clearSelect()
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.executeTakeFirstOrThrow();
			})
		: undefined;

	const countWhere = count.includes("where")
		? yield* Effect.promise(async () => {
				return whereSelect
					.clearSelect()
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.executeTakeFirstOrThrow();
			})
		: undefined;

	return {
		total: countTotal?.count ?? 0,
		filter: countFilter?.count ?? 0,
		where: countWhere?.count ?? 0,
	};
});

import { Effect } from "effect";
import { type SelectQueryBuilder, sql } from "kysely";
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
	const layers = [
		filter,
		where,
		scope,
	] as const;

	let qb = yield* selectFx;
	for (const layer of layers) {
		qb = yield* queryFx({
			select: qb,
			where: layer,
		});
	}

	const { count } = yield* Effect.promise(async () => {
		return qb
			.clearSelect()
			.clearOrderBy()
			.clearLimit()
			.clearOffset()
			.select(sql<number>`count(*)::int`.as("count"))
			.executeTakeFirstOrThrow();
	});

	return count;
});

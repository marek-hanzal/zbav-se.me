import { Effect } from "effect";
import { type SelectQueryBuilder, sql } from "kysely";
import type { WhereSchema } from "../schema/WhereSchema";
import type { selectFx } from "../select/selectFx";

export namespace withCountFx {
	export interface Props<
		TDB,
		TTable extends keyof TDB,
		TOutput,
		TWhere extends WhereSchema.Type,
		TSelectError,
		TSelectContext,
		TQueryError,
		TQueryContext,
	> {
		selectFx: selectFx<
			TDB,
			TTable,
			TOutput,
			TWhere,
			TSelectError,
			TSelectContext,
			TQueryError,
			TQueryContext
		>;
		//
		where?: TWhere;
		scope?: TWhere;
	}
}

export const withCountFx = Effect.fn("withCountFx")(function* <
	const TDB,
	const TTable extends keyof TDB,
	const TOutput,
	const TWhere extends WhereSchema.Type,
	const TSelectError,
	const TSelectContext,
	const TQueryError,
	const TQueryContext,
>({
	selectFx,
	where,
	scope,
}: withCountFx.Props<
	TDB,
	TTable,
	TOutput,
	TWhere,
	TSelectError,
	TSelectContext,
	TQueryError,
	TQueryContext
>) {
	const layers = [
		where,
		scope,
	] as const;

	let { select: qb, queryFx } = yield* selectFx;
	for (const layer of layers) {
		qb = yield* queryFx(qb, layer);
	}

	const { count } = yield* Effect.promise(async () => {
		/**
		 * A little ugly hack, but we're about to clear everything, so also need
		 * to push TypeScript a little bit.
		 *
		 * Sorry.
		 */
		return (qb as SelectQueryBuilder<any, any, any>)
			.clearSelect()
			.clearOrderBy()
			.clearLimit()
			.clearOffset()
			.select(sql<number>`count(*)::int`.as("count"))
			.executeTakeFirstOrThrow();
	});

	return count;
});

import type { Effect } from "effect";
import type { SelectQueryBuilder } from "kysely";
import type { WhereSchema } from "../schema/WhereSchema";

export type selectFx<
	TDB,
	TTable extends keyof TDB,
	TOutput,
	TWhere extends WhereSchema.Type,
	TSelectError,
	TSelectContext,
	TQueryError,
	TQueryContext,
> = Effect.Effect<
	{
		select: SelectQueryBuilder<TDB, TTable, TOutput>;
		queryFx(
			select: SelectQueryBuilder<TDB, TTable, TOutput>,
			where: TWhere | undefined,
		): Effect.Effect<SelectQueryBuilder<TDB, TTable, TOutput>, TQueryError, TQueryContext>;
	},
	TSelectError,
	TSelectContext
>;

/**
 * Dummy, just provides proper types, so everything should fit nicely.
 */
export const selectFx = <
	TDB,
	TTable extends keyof TDB,
	TOutput,
	TWhere extends WhereSchema.Type,
	TSelectError,
	TSelectContext,
	TQueryError,
	TQueryContext,
>(
	select: Effect.Effect.Success<
		selectFx<
			TDB,
			TTable,
			TOutput,
			TWhere,
			TSelectError,
			TSelectContext,
			TQueryError,
			TQueryContext
		>
	>,
): Effect.Effect.Success<
	selectFx<TDB, TTable, TOutput, TWhere, TSelectError, TSelectContext, TQueryError, TQueryContext>
> => {
	return select;
};

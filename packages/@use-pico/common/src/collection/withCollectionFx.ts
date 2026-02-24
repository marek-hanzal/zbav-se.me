import { Effect } from "effect";
import type { SelectQueryBuilder, Simplify } from "kysely";
import type z from "zod";
import type { CursorSchema } from "../schema/CursorSchema";
import type { FilterSchema } from "../schema/FilterSchema";

export namespace withCollectionFx {
	export type Output<TOutputSchema extends z.ZodSchema> = Simplify<z.infer<TOutputSchema>>;

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
		//
		filter?: TFilter;
		where?: TFilter;
		scope?: TFilter;
		//
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
	queryFx = ({ select }) => Effect.succeed(select),
	filter,
	where,
	scope,
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

	return yield* Effect.promise(async () => {
		return qb
			.limit(cursor.size)
			.offset(cursor.page * cursor.size)
			.execute();
	});
});

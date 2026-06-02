import { Effect } from "effect";
import type { Simplify } from "kysely";
import type { z } from "zod";
import type { CursorSchema } from "../schema/CursorSchema";
import type { WhereSchema } from "../schema/WhereSchema";
import type { selectFx } from "../select/selectFx";

export namespace withCollectionFx {
	export type Output<TOutputSchema extends z.ZodSchema> = Simplify<z.infer<TOutputSchema>>;

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
		//
		cursor: CursorSchema.Type;
		/**
		 * This prop limits the page size, so even thou "cursor" may ask for more, this is a guardrail
		 * to prevent overflowing the system/database.
		 */
		limit?: number;
	}
}

export const withCollectionFx = Effect.fn("withCollectionFx")(function* <
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
	cursor,
	limit,
}: withCollectionFx.Props<
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

	const size = Math.min(limit ?? cursor.size, cursor.size);

	return yield* Effect.promise(async () => {
		return qb
			.limit(size)
			.offset(cursor.page * size)
			.execute();
	});
});

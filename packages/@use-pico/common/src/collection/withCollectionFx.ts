import { Effect } from "effect";
import type { SelectQueryBuilder, Simplify } from "kysely";
import z from "zod";
import { zodFx } from "../schema";
import type { CursorSchema } from "../schema/CursorSchema";
import type { FilterSchema } from "../schema/FilterSchema";

export namespace withCollectionFx {
	export type Output<TOutputSchema extends z.ZodSchema> = Simplify<z.infer<TOutputSchema>>;

	export interface Result<TOutput> {
		data: TOutput[];
		more: boolean;
	}

	export namespace Query {
		export interface Props<
			TOutputSchema extends z.ZodSchema,
			TSelect extends SelectQueryBuilder<any, any, Output<TOutputSchema>>,
			TFilter extends FilterSchema.Type,
		> {
			select: TSelect;
			where?: TFilter;
		}
	}

	export interface Props<
		TOutputSchema extends z.ZodSchema,
		TSelect extends SelectQueryBuilder<any, any, Output<TOutputSchema>>,
		TFilter extends FilterSchema.Type,
		TQueryError,
		TQueryContext,
	> {
		select: TSelect;
		queryFx?(
			props: Query.Props<TOutputSchema, TSelect, TFilter>,
		): Effect.Effect<TSelect, TQueryError, TQueryContext>;

		output: TOutputSchema;

		filter?: TFilter;
		where?: TFilter;
		cursor: CursorSchema.Type;
	}
}

export const withCollectionFx = Effect.fn("withCollectionFx")(function* <
	const TOutputSchema extends z.ZodSchema,
	const TSelect extends SelectQueryBuilder<any, any, withCollectionFx.Output<TOutputSchema>>,
	const TFilter extends FilterSchema.Type,
	const TQueryError,
	const TQueryContext,
>({
	select,
	queryFx = () => Effect.succeed(select),
	output,
	filter,
	where,
	cursor,
}: withCollectionFx.Props<TOutputSchema, TSelect, TFilter, TQueryError, TQueryContext>) {
	const whereSelect = yield* queryFx({
		select,
		where,
	});
	const filterSelect = yield* queryFx({
		select: whereSelect,
		where: filter,
	});

	const results = yield* Effect.promise(async () => {
		return filterSelect
			.limit(cursor.size + 1)
			.offset(cursor.page * cursor.size)
			.execute();
	});

	return {
		data: yield* zodFx({
			schema: z.array(output),
			data: results.slice(0, cursor.size),
		}),
		more: results.length > cursor.size,
	};
});

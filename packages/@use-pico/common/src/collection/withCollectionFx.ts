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
	> {
		select: TSelect;
		query?(props: Query.Props<TOutputSchema, TSelect, TFilter>): TSelect;

		output: TOutputSchema;

		filter?: TFilter;
		where?: TFilter;
		cursor: CursorSchema.Type;
	}
}

export const withCollectionFx = Effect.fn("withCollectionFx")(function* <
	TOutputSchema extends z.ZodSchema,
	TSelect extends SelectQueryBuilder<any, any, withCollectionFx.Output<TOutputSchema>>,
	TFilter extends FilterSchema.Type,
>({
	select,
	query = () => select,
	output,
	filter,
	where,
	cursor,
}: withCollectionFx.Props<TOutputSchema, TSelect, TFilter>) {
	const results = yield* Effect.promise(async () => {
		return await query({
			select: query({
				select,
				where,
			}),
			where: filter,
		})
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

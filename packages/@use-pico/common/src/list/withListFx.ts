import { Effect } from "effect";
import type { SelectQueryBuilder, Simplify } from "kysely";
import z from "zod";
import type { CursorSchema } from "../schema/CursorSchema";
import type { FilterSchema } from "../schema/FilterSchema";
import { zodFx } from "../schema/zodFx";

export namespace withListFx {
	export type Output<TOutputSchema extends z.ZodSchema> = Simplify<z.infer<TOutputSchema>>;

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
		cursor?: CursorSchema.Type;
	}
}

export const withListFx = Effect.fn("withListFx")(function* <
	const TOutputSchema extends z.ZodSchema,
	const TSelect extends SelectQueryBuilder<any, any, withListFx.Output<TOutputSchema>>,
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
}: withListFx.Props<TOutputSchema, TSelect, TFilter, TQueryError, TQueryContext>) {
	const limit = (select: SelectQueryBuilder<any, any, any>): TSelect => {
		let $select = select;

		if (cursor) {
			$select = select.limit(cursor.size).offset(cursor.page * cursor.size);
		}

		return $select as TSelect;
	};

	const whereSelect = yield* queryFx({
		select,
		where,
	});
	const filterSelect = yield* queryFx({
		select: whereSelect,
		where: filter,
	});

	const result = yield* Effect.promise(async () => {
		await limit(filterSelect).execute();
	});

	return yield* zodFx({
		schema: z.array(output),
		data: result,
	});
});

import { Effect } from "effect";
import type { SelectQueryBuilder, Simplify } from "kysely";
import type { z } from "zod";
import { NotFoundErrorFx } from "../error/NotFoundErrorFx";
import type { FilterSchema } from "../schema/FilterSchema";
import { zodFx } from "../schema/zodFx";

export namespace withFetchFx {
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
		resource: string;
		select: TSelect;
		queryFx?(
			props: Query.Props<TOutputSchema, TSelect, TFilter>,
		): Effect.Effect<TSelect, TQueryError, TQueryContext>;

		output: TOutputSchema;

		filter?: TFilter;
		where?: TFilter;
	}
}

export const withFetchFx = Effect.fn("withFetchFx")(function* <
	const TOutputSchema extends z.ZodSchema,
	const TSelect extends SelectQueryBuilder<any, any, withFetchFx.Output<TOutputSchema>>,
	const TFilter extends FilterSchema.Type,
	const TQueryError,
	const TQueryContext,
>({
	resource,
	select,
	queryFx = () => Effect.succeed(select),
	output,
	filter,
	where,
}: withFetchFx.Props<TOutputSchema, TSelect, TFilter, TQueryError, TQueryContext>) {
	const whereSelect = yield* queryFx({
		select,
		where,
	});
	const filterSelect = yield* queryFx({
		select: whereSelect,
		where: filter,
	});

	const result = yield* Effect.promise(async () => {
		return filterSelect.executeTakeFirst();
	});

	if (!result) {
		return yield* new NotFoundErrorFx({
			resource,
			resourceId: JSON.stringify({
				filter,
				where,
			}),
			message: "Resource not found",
		});
	}

	return yield* zodFx({
		schema: output,
		data: result,
	});
});

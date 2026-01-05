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
	> {
		resource: string;
		select: TSelect;
		query?(props: Query.Props<TOutputSchema, TSelect, TFilter>): TSelect;

		output: TOutputSchema;

		filter?: TFilter;
		where?: TFilter;
	}
}

export const withFetchFx = Effect.fn("withFetchFx")(function* <
	TOutputSchema extends z.ZodSchema,
	TSelect extends SelectQueryBuilder<any, any, withFetchFx.Output<TOutputSchema>>,
	TFilter extends FilterSchema.Type,
>({
	resource,
	select,
	query = () => select,
	output,
	filter,
	where,
}: withFetchFx.Props<TOutputSchema, TSelect, TFilter>) {
	const result = Effect.promise(async () => {
		return query({
			select: query({
				select,
				where,
			}),
			where: filter,
		}).executeTakeFirst();
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

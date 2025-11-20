import type { InferResult, SelectQueryBuilder } from "kysely";
import type { z } from "zod";

type Elem<T> = T extends readonly (infer U)[] ? U : T;

type NonNullish<T> = Exclude<T, null | undefined>;

type SchemaRow<TOutputSchema extends z.ZodTypeAny> = Elem<NonNullish<z.infer<TOutputSchema>>>;

type SchemaRowKeys<TOutputSchema extends z.ZodTypeAny> = keyof SchemaRow<TOutputSchema>;

type SelectKeys<TSelect extends SelectQueryBuilder<any, any, any>> =
	keyof InferResult<TSelect>[number];

type MissingInSelect<
	TSelect extends SelectQueryBuilder<any, any, any>,
	TOutputSchema extends z.ZodTypeAny,
> = Exclude<SchemaRowKeys<TOutputSchema>, SelectKeys<TSelect>>;

type FormatError<
	TSelect extends SelectQueryBuilder<any, any, any>,
	TOutputSchema extends z.ZodTypeAny,
> = MissingInSelect<TSelect, TOutputSchema> extends never
	? never
	: {
			missingInSelect: MissingInSelect<TSelect, TOutputSchema>;
		};

export type EnsureSelectOutputSchema<
	TSelect extends SelectQueryBuilder<any, any, any>,
	TOutputSchema extends z.ZodTypeAny,
> = MissingInSelect<TSelect, TOutputSchema> extends never
	? TOutputSchema
	: FormatError<TSelect, TOutputSchema>;

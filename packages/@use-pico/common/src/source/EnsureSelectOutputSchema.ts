import type { InferResult, SelectQueryBuilder } from "kysely";
import type { z } from "zod";
import type { IsSame } from "../type/IsSame";

type Elem<T> = T extends readonly (infer U)[] ? U : T;

type NonNullish<T> = Exclude<T, null | undefined>;

type SchemaRow<TOutputSchema extends z.ZodTypeAny> = Elem<NonNullish<z.infer<TOutputSchema>>>;

// Klíče řádku ze schématu
type SchemaRowKeys<TOutputSchema extends z.ZodTypeAny> = keyof SchemaRow<TOutputSchema>;

// Kysely klíče řádku
type SelectKeys<TSelect extends SelectQueryBuilder<any, any, any>> =
	keyof InferResult<TSelect>[number];

type MissingInSchema<
	TSelect extends SelectQueryBuilder<any, any, any>,
	TOutputSchema extends z.ZodTypeAny,
> = Exclude<SelectKeys<TSelect>, SchemaRowKeys<TOutputSchema>>;

type MissingInSelect<
	TSelect extends SelectQueryBuilder<any, any, any>,
	TOutputSchema extends z.ZodTypeAny,
> = Exclude<SchemaRowKeys<TOutputSchema>, SelectKeys<TSelect>>;

type FormatError<
	TSelect extends SelectQueryBuilder<any, any, any>,
	TOutputSchema extends z.ZodTypeAny,
> = MissingInSchema<TSelect, TOutputSchema> extends never
	? MissingInSelect<TSelect, TOutputSchema> extends never
		? never
		: {
				error: "Schema has extra fields that are not in select result";
				missingInSelect: MissingInSelect<TSelect, TOutputSchema>;
			}
	: MissingInSelect<TSelect, TOutputSchema> extends never
		? {
				error: "Select result has extra fields that are not in schema";
				missingInSchema: MissingInSchema<TSelect, TOutputSchema>;
			}
		: {
				error: "Select result and schema have mismatched fields";
				missingInSchema: MissingInSchema<TSelect, TOutputSchema>;
				missingInSelect: MissingInSelect<TSelect, TOutputSchema>;
			};

export type EnsureSelectOutputSchema<
	TSelect extends SelectQueryBuilder<any, any, any>,
	TOutputSchema extends z.ZodTypeAny,
> = IsSame<
	Record<SelectKeys<TSelect>, unknown>,
	Record<SchemaRowKeys<TOutputSchema>, unknown>
> extends true
	? TOutputSchema
	: FormatError<TSelect, TOutputSchema>;

import type { InferResult, SelectQueryBuilder } from "kysely";
import type { z } from "zod";

type AsObject<T> = NonNullable<T> extends object ? NonNullable<T> : never;

type ZodObject<TSchema extends z.ZodTypeAny> = AsObject<z.infer<TSchema>>;

type SelectObject<TSelect extends SelectQueryBuilder<any, any, any>> = AsObject<
	InferResult<TSelect>[number]
>;

type ArrayElement<T> = T extends readonly (infer U)[] ? NonNullable<U> : never;

type DeepKeysImpl<T, P extends string> = NonNullable<T> extends readonly any[]
	? DeepKeysImpl<ArrayElement<NonNullable<T>>, P>
	: NonNullable<T> extends object
		? DeepKeysObject<NonNullable<T>, P>
		: never;

type DeepKeysObject<TObj, P extends string> = {
	[K in keyof TObj & string]: `${P}${K}` | DeepKeysImpl<NonNullable<TObj[K]>, `${P}${K}.`>;
}[keyof TObj & string];

type DeepKeys<T, P extends string = ""> = T extends any ? DeepKeysImpl<T, P> : never;

type MissingKeys<TZodObject extends object, TSelectObject extends object> = Exclude<
	DeepKeys<TZodObject>,
	DeepKeys<TSelectObject>
>;

type FormatError<TZodObject extends object, TSelectObject extends object> = MissingKeys<
	TZodObject,
	TSelectObject
> extends never
	? never
	: {
			missingInSelect: MissingKeys<TZodObject, TSelectObject>;
		};

export type EnsureSelectOutputSchema<
	TSelect extends SelectQueryBuilder<any, any, any>,
	TSchema extends z.ZodTypeAny,
> = MissingKeys<ZodObject<TSchema>, SelectObject<TSelect>> extends never
	? TSchema
	: FormatError<ZodObject<TSchema>, SelectObject<TSelect>>;

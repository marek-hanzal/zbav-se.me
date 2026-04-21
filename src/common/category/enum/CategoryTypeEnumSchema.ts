import { z } from "zod";

export const CategoryTypeEnumSchema = z
	.enum([
		"implicit",
		"explicit",
	])
	.meta({
		id: "CategoryTypeEnum",
		description: `
Defines whether listings from a category are included in broad listing queries.

Meanings:
- implicit - included in default listing queries without an explicit category filter
- explicit - included only when the query explicitly asks for the category
        `.trim(),
	});

export type CategoryTypeEnumSchema = typeof CategoryTypeEnumSchema;

export namespace CategoryTypeEnumSchema {
	export type Type = z.infer<CategoryTypeEnumSchema>;
}

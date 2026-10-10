import { z } from "zod";

export const CategoryDiscoveryEnumSchema = z
	.enum([
		"implicit",
		"explicit",
	])
	.meta({
		id: "CategoryDiscoveryEnum",
		description: `
Defines whether listings from a category are included in broad listing queries.

Meanings:
- implicit - included in default listing queries without an explicit category filter
- explicit - included only when the query explicitly asks for the category
        `.trim(),
	});

export type CategoryDiscoveryEnumSchema = typeof CategoryDiscoveryEnumSchema;

export namespace CategoryDiscoveryEnumSchema {
	export type Type = z.infer<CategoryDiscoveryEnumSchema>;
}

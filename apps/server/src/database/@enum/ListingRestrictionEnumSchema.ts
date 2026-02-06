import { z } from "@hono/zod-openapi";

export const ListingRestrictionEnumSchema = z
	.enum([
		"none",
		"adult",
		"sensitive",
		"restricted",
	])
	.openapi("ListingRestrictionEnum", {
		description: "Content restriction level of the listing",
	});

export type ListingRestrictionEnumSchema = typeof ListingRestrictionEnumSchema;

export namespace ListingRestrictionEnumSchema {
	export type Type = z.infer<ListingRestrictionEnumSchema>;
}

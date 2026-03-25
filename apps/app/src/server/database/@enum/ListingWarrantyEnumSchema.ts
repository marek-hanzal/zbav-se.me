import { z } from "@hono/zod-openapi";

export const ListingWarrantyEnumSchema = z
	.enum([
		"warranty",
		"no-warranty",
		"custom",
	])
	.openapi("ListingWarrantyEnum", {
		description: "Warranty type for the listing",
	});

export type ListingWarrantyEnumSchema = typeof ListingWarrantyEnumSchema;

export namespace ListingWarrantyEnumSchema {
	export type Type = z.infer<ListingWarrantyEnumSchema>;
}

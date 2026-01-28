import { z } from "@hono/zod-openapi";

export const ListingPriceEnumSchema = z
	.enum([
		"closed",
		"open",
	])
	.openapi("ListingPriceEnum", {
		description: "Price type of the listing",
	});

export type ListingPriceEnumSchema = typeof ListingPriceEnumSchema;

export namespace ListingPriceEnumSchema {
	export type Type = z.infer<ListingPriceEnumSchema>;
}

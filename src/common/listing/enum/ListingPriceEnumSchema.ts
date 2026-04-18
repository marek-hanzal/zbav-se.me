import { z } from "zod";

export const ListingPriceEnumSchema = z
	.enum([
		"closed",
		"open",
		"offer",
	])
	.meta({
		id: "ListingPriceEnum",
		description: "Price type of the listing",
	});

export type ListingPriceEnumSchema = typeof ListingPriceEnumSchema;

export namespace ListingPriceEnumSchema {
	export type Type = z.infer<ListingPriceEnumSchema>;
}

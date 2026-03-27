import { z } from "zod";

export const ListingExpireEnumSchema = z
	.enum([
		"7-days",
		"14-days",
		"1-month",
	])
	.meta({
		id: "ListingExpireEnum",
		description: "Expiration time of the listing",
	});

export type ListingExpireEnumSchema = typeof ListingExpireEnumSchema;

export namespace ListingExpireEnumSchema {
	export type Type = z.infer<ListingExpireEnumSchema>;
}

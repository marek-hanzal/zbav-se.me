import { z } from "zod";

export const ListingWarrantyEnumSchema = z
	.enum([
		"warranty",
		"no-warranty",
		"custom",
	])
	.meta({
		id: "ListingWarrantyEnum",
		description: "Warranty type for the listing",
	});

export type ListingWarrantyEnumSchema = typeof ListingWarrantyEnumSchema;

export namespace ListingWarrantyEnumSchema {
	export type Type = z.infer<ListingWarrantyEnumSchema>;
}

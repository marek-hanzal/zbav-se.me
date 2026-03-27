import { z } from "zod";

export const ListingRestrictionEnumSchema = z
	.enum([
		"none",
		"adult-relaxed",
		"adult",
		"sensitive",
		"restricted",
	])
	.meta({
		id: "ListingRestrictionEnum",
		description: "Content restriction level of the listing",
	});

export type ListingRestrictionEnumSchema = typeof ListingRestrictionEnumSchema;

export namespace ListingRestrictionEnumSchema {
	export type Type = z.infer<ListingRestrictionEnumSchema>;
}

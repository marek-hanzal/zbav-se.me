import { z } from "zod";

export const ListingMetaSchema = z
	.looseObject({
		locationId: z.string().min(1, "Location ID is required").optional().meta({
			id: "PublicListingLocationId",
			description: "Reference location used for public listing geo targeting",
		}),
	})
	.strip()
	.meta({
		id: "PublicListingMeta",
		description: "Meta data for public listing collection",
	});

export type ListingMetaSchema = typeof ListingMetaSchema;

export namespace ListingMetaSchema {
	export type Type = z.infer<ListingMetaSchema>;
}

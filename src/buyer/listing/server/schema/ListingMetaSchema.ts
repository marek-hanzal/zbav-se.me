import { z } from "zod";

export const ListingMetaSchema = z
	.looseObject({
		locationId: z.string().min(1, "Location ID is required").optional().meta({
			id: "ListingLocationId",
			description: "Reference location used for listing geo targeting and distance sorting",
		}),
		feedId: z.string().min(1, "Feed ID is required").optional().meta({
			id: "FeedId",
			description: "Reference feed to do counts e.g. like is in favourites",
		}),
	})
	.strip()
	.meta({
		id: "ListingMeta",
		description: "Important metadata for listing location targeting and related feedId.",
	});

export type ListingMetaSchema = typeof ListingMetaSchema;

export namespace ListingMetaSchema {
	export type Type = z.infer<ListingMetaSchema>;
}

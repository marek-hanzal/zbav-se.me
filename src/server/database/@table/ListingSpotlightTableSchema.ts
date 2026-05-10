import { z } from "zod";

export const ListingSpotlightTableSchema = z
	.looseObject({
		listingId: z.string().meta({
			description: "ID of the listing this spotlight entry belongs to",
		}),
		text: z.string().meta({
			description: "Normalized spotlight phrase used for listing fulltext search",
		}),
		ranking: z.number().int().meta({
			description: "Relative spotlight ranking used for future ordering tweaks",
		}),
	})
	.meta({
		id: "ListingSpotlightTable",
		description: "Database row for a listing spotlight entry.",
	})
	.strip();

export type ListingSpotlightTableSchema = typeof ListingSpotlightTableSchema;

export namespace ListingSpotlightTableSchema {
	export type Type = z.infer<ListingSpotlightTableSchema>;
}

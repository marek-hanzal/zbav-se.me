import { z } from "zod";
import { LatLonSchema } from "@/lib/common/location";

export const ListingMetaSchema = z
	.looseObject({
		latLon: LatLonSchema.optional(),
		feedId: z.string().min(1, "Feed ID is required").optional().meta({
			id: "FeedId",
			description: "Reference feed to do counts e.g. like is in favourites",
		}),
	})
	.strip()
	.meta({
		id: "ListingMeta",
		description:
			"Important metadata for e.g. location targeting of listings and related feedId.",
	});

export type ListingMetaSchema = typeof ListingMetaSchema;

export namespace ListingMetaSchema {
	export type Type = z.infer<ListingMetaSchema>;
}

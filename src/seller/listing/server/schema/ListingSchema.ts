import { z } from "zod";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.shape,
	})
	.omit({
		userId: true,
		galleryId: true,
		withCategoryDiscovery: true,
		withCategoryRestriction: true,
	})
	.strip()
	.meta({
		id: "Listing",
		description: "Listing data",
	});

export type ListingSchema = typeof ListingSchema;

export namespace ListingSchema {
	export type Type = z.infer<ListingSchema>;
}

import { z } from "zod";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";
import { CategorySchema } from "~/session/category/server/schema/CategorySchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.shape,
		location: LocationSchema,
		category: CategorySchema,
		gallery: GallerySchema.meta({
			description: "Listing gallery images",
		}),
	})
	.omit({
		userId: true,
		titleVec: true,
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

import { z } from "zod";
import { CategorySchema } from "~/client/@session/category/server/schema/CategorySchema";
import { LocationSchema } from "~/client/@session/location/server/schema/LocationSchema";
import { GallerySchema } from "~/client/@user/gallery/server/schema/GallerySchema";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";

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

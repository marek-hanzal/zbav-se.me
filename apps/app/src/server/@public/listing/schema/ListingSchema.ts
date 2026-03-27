import { z } from "zod";
import { CategorySchema } from "~/server/@session/category/schema/CategorySchema";
import { LocationSchema } from "~/server/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/server/@user/gallery/schema/GallerySchema";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";

export const ListingSchema = z
	.looseObject({
		id: ListingTableSchema.shape.id,
		title: ListingTableSchema.shape.title,
		price: ListingTableSchema.shape.price,
		priceType: ListingTableSchema.shape.priceType,
		currency: ListingTableSchema.shape.currency,
		createdAt: ListingTableSchema.shape.createdAt,
		location: LocationSchema,
		category: CategorySchema,
		gallery: GallerySchema.meta({
			description: "Listing gallery images",
		}),
	})
	.strip()
	.meta({
		id: "PublicListing",
		description: "Public listing data",
	});

export type ListingSchema = typeof ListingSchema;

export namespace ListingSchema {
	export type Type = z.infer<ListingSchema>;
}

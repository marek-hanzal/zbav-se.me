import { z } from "zod";
import { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";
import { CategorySchema } from "~/session/category/server/schema/CategorySchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";

export const ListingSchema = z
	.looseObject({
		id: ListingTableSchema.shape.id,
		title: ListingTableSchema.shape.title,
		price: ListingTableSchema.shape.price,
		priceType: ListingTableSchema.shape.priceType,
		currency: ListingTableSchema.shape.currency,
		createdAt: ListingTableSchema.shape.createdAt,
		restrictions: z.array(CategoryRestrictionEnumSchema).meta({
			description: `
Computed restrictions from category and listing. Read-only.
            `.trim(),
		}),
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

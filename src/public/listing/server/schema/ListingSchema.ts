import { z } from "zod";
import { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import { CategorySchema } from "~/public/category/server/schema/CategorySchema";
import { GallerySchema } from "~/public/gallery/server/schema/GallerySchema";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.pick({
			id: true,
			title: true,
			price: true,
			priceType: true,
			currency: true,
			createdAt: true,
		}).shape,
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

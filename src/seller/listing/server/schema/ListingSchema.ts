import { z } from "zod";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import { CategorySchema } from "~/user/category/server/schema/CategorySchema";
import { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.shape,
		location: LocationSchema,
		category: CategorySchema,
		gallery: GallerySchema.meta({
			description: "Listing gallery images",
		}),
		restrictions: z.array(RestrictionEnumSchema).meta({
			description: `
Computed restrictions from category and listing. Read-only.
            `.trim(),
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

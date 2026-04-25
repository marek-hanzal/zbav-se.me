import { z } from "zod";
import { ThumbEnumSchema } from "~/common/listing/enum/ThumbEnumSchema";
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
		distance: z.number().nullable().meta({
			description:
				"Distance from the input location to the listing (in km; meta lat/lon must be provided)",
		}),
		gallery: GallerySchema.meta({
			description: "Listing gallery images",
		}),
		my: z.boolean().meta({
			description: "Whether the listing belongs to the current user",
		}),
		isFavourite: z.boolean().meta({
			description: "Whether the user has this listing in favourites",
		}),
		isIgnored: z.boolean().meta({
			description: "Whether the user ignored this listing",
		}),
		hasFlag: z.boolean().meta({
			description: "Whether the user flagged this listing",
		}),
		transactionId: z.string().nullable().meta({
			description: "Whether the user has a transaction with this listing",
		}),
		thumb: ThumbEnumSchema.nullable().meta({
			description: "Thumb type provided by the user (like/dislike) or null if not present",
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
		withCategoryDiscovery: true,
		withCategoryRestriction: true,
		withLocationGeo: true,
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

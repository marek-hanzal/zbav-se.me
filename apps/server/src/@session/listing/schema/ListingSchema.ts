import { z } from "@hono/zod-openapi";
import { CategorySchema } from "~/@session/category/schema/CategorySchema";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { ThumbEnumSchema } from "~/@user/thumb/schema/ThumbEnumSchema";
import { ListingTableSchema } from "~/database/@table/ListingTableSchema";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.shape,
		location: LocationSchema,
		category: CategorySchema,
		distance: z.number().nullable().openapi({
			description:
				"Distance from the input location to the listing (in km; meta lat/lon must be provided)",
		}),
		gallery: GallerySchema.openapi({
			description: "Listing gallery images",
		}),
		isFavourite: z.boolean().openapi({
			description: "Whether the user has this listing in favourites",
		}),
		isIgnored: z.boolean().openapi({
			description: "Whether the user ignored this listing",
		}),
		hasFlag: z.boolean().openapi({
			description: "Whether the user flagged this listing",
		}),
		transactionId: z
			.union([
				z.string(),
				z.null(),
			])
			.openapi({
				description: "Whether the user has a transaction with this listing",
			}),
		thumb: z
			.union([
				ThumbEnumSchema,
				z.null(),
			])
			.openapi({
				description:
					"Thumb type provided by the user (like/dislike) or null if not present",
			}),
	})
	.omit({
		userId: true,
		titleVec: true,
	})
	.strip()
	.openapi("Listing", {
		description: "Listing data",
	});

export type ListingSchema = typeof ListingSchema;

export namespace ListingSchema {
	export type Type = z.infer<ListingSchema>;
}

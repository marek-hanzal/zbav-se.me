import { z } from "@hono/zod-openapi";
import { CategorySchema } from "~/@session/category/schema/CategorySchema";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { ThumbEnumSchema } from "~/database/@enum/ThumbEnumSchema";
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
		my: z.boolean().openapi({
			description: "Whether the listing belongs to the current user",
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
				z.null(),
				z.string(),
			])
			.openapi({
				description: "Whether the user has a transaction with this listing",
			}),
		thumb: z
			.union([
				z.null(),
				ThumbEnumSchema,
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

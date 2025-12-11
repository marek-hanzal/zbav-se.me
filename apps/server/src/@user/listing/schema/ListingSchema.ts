import { z } from "@hono/zod-openapi";
import { CategorySchema } from "~/@session/category/schema/CategorySchema";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { ListingDbSchema } from "~/app/listing/schema/ListingDbSchema";

export const ListingSchema = z
	.looseObject({
		...ListingDbSchema.shape,
		location: LocationSchema,
		category: CategorySchema,
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

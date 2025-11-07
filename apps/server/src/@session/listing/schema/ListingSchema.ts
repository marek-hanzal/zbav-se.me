import { z } from "@hono/zod-openapi";
import { CategorySchema } from "../../category/schema/CategorySchema";
import { GallerySchema } from "../../gallery/schema/GallerySchema";
import { LocationSchema } from "../../location/schema/LocationSchema";
import { ListingDbSchema } from "./ListingDbSchema";

export const ListingSchema = z
	.object({
		...ListingDbSchema.shape,
		location: LocationSchema,
		category: CategorySchema,
		gallery: z.array(GallerySchema).openapi({
			description: "Array of listing gallery images",
		}),
		isInCart: z.boolean().openapi({
			description: "Whether the user has this listing in the cart",
		}),
		isIgnored: z.boolean().openapi({
			description: "Whether the user ignored this listing",
		}),
		hasFlag: z.boolean().openapi({
			description: "Whether the user flagged this listing",
		}),
	})
	.omit({
		userId: true,
		titleVec: true,
		priceVec: true,
		conditionVec: true,
		ageVec: true,
	})
	.openapi("Listing");

export type ListingSchema = typeof ListingSchema;

export namespace ListingSchema {
	export type Type = z.infer<ListingSchema>;
}

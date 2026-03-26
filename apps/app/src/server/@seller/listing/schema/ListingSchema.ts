import { z } from "@hono/zod-openapi";
import { CategorySchema } from "~/server/@session/category/schema/CategorySchema";
import { LocationSchema } from "~/server/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/server/@user/gallery/schema/GallerySchema";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.shape,
		location: LocationSchema,
		category: CategorySchema,
		gallery: GallerySchema.openapi({
			description: "Listing gallery images",
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

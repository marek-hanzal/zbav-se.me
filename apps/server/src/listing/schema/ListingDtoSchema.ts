import { z } from "@hono/zod-openapi";
import { CategoryDtoSchema } from "../../category/schema/CategoryDtoSchema";
import { GalleryDtoSchema } from "../../gallery/schema/GalleryDtoSchema";
import { LocationDtoSchema } from "../../location/schema/LocationDtoSchema";
import { ListingSchema } from "./ListingSchema";

export const ListingDtoSchema = z
	.object({
		...ListingSchema.shape,
		location: LocationDtoSchema,
		category: CategoryDtoSchema,
		gallery: z.array(GalleryDtoSchema).openapi({
			description: "Array of listing gallery images",
		}),
	})
	.omit({
		userId: true,
	})
	.openapi("ListingDto");

export type ListingDtoSchema = typeof ListingDtoSchema;

export namespace ListingDtoSchema {
	export type Type = z.infer<ListingDtoSchema>;
}

import z from "zod";
import { CategorySchema } from "../../category/schema/CategorySchema";
import { GalleryDtoSchema } from "../../gallery/schema/GalleryDtoSchema";
import { LocationSchema } from "../../location/schema/LocationSchema";
import { ListingSchema } from "./ListingSchema";

export const ListingDtoSchema = z
	.object({
		...ListingSchema.shape,
		location: LocationSchema,
		category: CategorySchema,
		gallery: z.array(GalleryDtoSchema).openapi({
			description: "Array of listing gallery images",
		}),
	})
	.openapi("ListingDto");

export type ListingDtoSchema = typeof ListingDtoSchema;

export namespace ListingDtoSchema {
	export type Type = z.infer<ListingDtoSchema>;
}

import z from "zod";
import { CategorySchema } from "../../category/schema/CategorySchema";
import { CategoryGroupSchema } from "../../category-group/schema/CategoryGroupSchema";
import { LocationSchema } from "../../location/schema/LocationSchema";
import { ListingSchema } from "./ListingSchema";

export const ListingDtoSchema = z
	.object({
		...ListingSchema.shape,
		location: LocationSchema,
		category: CategorySchema,
		categoryGroup: CategoryGroupSchema,
		gallery: z
			.array(
				z.object({
					id: z.string(),
					url: z.string(),
					sort: z.number().int().gte(0),
				}),
			)
			.openapi({
				description: "Array of listing gallery images",
			}),
	})
	.openapi("ListingDto");

export type ListingDtoSchema = typeof ListingDtoSchema;

export namespace ListingDtoSchema {
	export type Type = z.infer<ListingDtoSchema>;
}

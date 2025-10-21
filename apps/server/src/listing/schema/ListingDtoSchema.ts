import z from "zod";
import { ListingSchema } from "./ListingSchema";

export const ListingDtoSchema = z
	.object({
		...ListingSchema.shape,
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

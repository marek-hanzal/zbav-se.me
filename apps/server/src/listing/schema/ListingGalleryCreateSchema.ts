import { z } from "@hono/zod-openapi";

export const ListingGalleryCreateSchema = z
	.object({
		listingId: z.string().openapi({
			description: "ID of the listing to add the image to",
		}),
		url: z.url().openapi({
			description:
				"Public URL of the image to add to the listing's gallery",
		}),
		sort: z.number().int().positive().openapi({
			description: "Sort order of the image in the listing's gallery",
		}),
	})
	.openapi("ListingGalleryCreate", {
		description: "Data required to add an image to a listing's gallery",
	});

export type ListingGalleryCreateSchema = typeof ListingGalleryCreateSchema;

export namespace ListingGalleryCreateSchema {
	export type Type = z.infer<typeof ListingGalleryCreateSchema>;
}

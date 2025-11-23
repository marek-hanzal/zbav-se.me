import { z } from "@hono/zod-openapi";

export const ListingGalleryDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the listing-gallery relationship",
	}),
	listingId: z.string().openapi({
		description: "ID of the listing",
	}),
	galleryId: z.string().openapi({
		description: "ID of the gallery",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type ListingGalleryDbSchema = typeof ListingGalleryDbSchema;

export namespace ListingGalleryDbSchema {
	export type Type = z.infer<ListingGalleryDbSchema>;
}

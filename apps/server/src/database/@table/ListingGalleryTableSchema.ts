import { z } from "@hono/zod-openapi";

export const ListingGalleryTableSchema = z.object({
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

export type ListingGalleryTableSchema = typeof ListingGalleryTableSchema;

export namespace ListingGalleryTableSchema {
	export type Type = z.infer<ListingGalleryTableSchema>;
}

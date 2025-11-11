import { z } from "@hono/zod-openapi";

export const GalleryDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the gallery item",
	}),
	userId: z.string().openapi({
		description: "ID of the user who owns the gallery item",
	}),
	listingId: z.string().openapi({
		description: "ID of the listing this image belongs to",
	}),
	uploadId: z.string().openapi({
		description: "ID of the upload this image belongs to",
	}),
	sort: z.number().openapi({
		description: "Sort order of the image in the listing's gallery",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type GalleryDbSchema = typeof GalleryDbSchema;

export namespace GalleryDbSchema {
	export type Type = z.infer<GalleryDbSchema>;
}

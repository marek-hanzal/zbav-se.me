import { z } from "@hono/zod-openapi";

export const GalleryItemDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the gallery item",
	}),
	galleryId: z.string().openapi({
		description: "ID of the gallery this item belongs to",
	}),
	uploadId: z.string().openapi({
		description: "ID of the upload this image belongs to",
	}),
	sort: z.number().openapi({
		description: "Sort order of the image in the gallery",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type GalleryItemDbSchema = typeof GalleryItemDbSchema;

export namespace GalleryItemDbSchema {
	export type Type = z.infer<GalleryItemDbSchema>;
}

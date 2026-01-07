import { z } from "@hono/zod-openapi";

export const GalleryItemCreateSchema = z
	.looseObject({
		galleryId: z.string().openapi({
			description: "ID of the gallery this item belongs to",
		}),
		uploadId: z.string().openapi({
			description: "ID of the upload this image belongs to",
		}),
		sort: z.number().openapi({
			description: "Sort order of the image in the gallery",
		}),
	})
	.strip()
	.openapi("GalleryItemCreate", {
		description: "Data for creating a new gallery item",
	});

export type GalleryItemCreateSchema = typeof GalleryItemCreateSchema;

export namespace GalleryItemCreateSchema {
	export type Type = z.infer<typeof GalleryItemCreateSchema>;
}

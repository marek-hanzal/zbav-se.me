import { z } from "zod";

export const GalleryItemCreateSchema = z
	.looseObject({
		galleryId: z.string().meta({
			description: "ID of the gallery this item belongs to",
		}),
		uploadId: z.string().meta({
			description: "ID of the upload this image belongs to",
		}),
		sort: z.number().meta({
			description: "Sort order of the image in the gallery",
		}),
	})
	.strip()
	.meta({
		id: "GalleryItemCreate",
		description: "Data for creating a new gallery item",
	});

export type GalleryItemCreateSchema = typeof GalleryItemCreateSchema;

export namespace GalleryItemCreateSchema {
	export type Type = z.infer<GalleryItemCreateSchema>;
}

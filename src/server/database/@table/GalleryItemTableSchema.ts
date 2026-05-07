import { z } from "zod";

export const GalleryItemTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the gallery item",
		}),
		galleryId: z.string().meta({
			description: "ID of the gallery this item belongs to",
		}),
		uploadId: z.string().meta({
			description: "ID of the upload this image belongs to",
		}),
		sort: z.number().meta({
			description: "Sort order of the image in the gallery",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "GalleryItemTable",
		description: "Database row for a gallery item.",
	})
	.strip();

export type GalleryItemTableSchema = typeof GalleryItemTableSchema;

export namespace GalleryItemTableSchema {
	export type Type = z.infer<GalleryItemTableSchema>;
}

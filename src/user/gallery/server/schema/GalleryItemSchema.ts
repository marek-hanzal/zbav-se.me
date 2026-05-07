import { z } from "zod";

export const GalleryItemSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the gallery",
		}),
	})
	.strip()
	.meta({
		id: "GalleryItem",
		description: "Gallery collection item",
	});

export type GalleryItemSchema = typeof GalleryItemSchema;

export namespace GalleryItemSchema {
	export type Type = z.infer<GalleryItemSchema>;
}

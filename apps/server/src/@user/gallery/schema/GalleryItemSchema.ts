import { z } from "@hono/zod-openapi";

export const GalleryItemSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the gallery",
		}),
	})
	.strip()
	.openapi("GalleryItem", {
		description: "Gallery collection item",
	});

export type GalleryItemSchema = typeof GalleryItemSchema;

export namespace GalleryItemSchema {
	export type Type = z.infer<GalleryItemSchema>;
}

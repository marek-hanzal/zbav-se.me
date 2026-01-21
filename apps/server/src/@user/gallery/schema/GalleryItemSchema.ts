import { z } from "@hono/zod-openapi";

export const GalleryItemSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the gallery",
		}),
	})
	.openapi("GalleryItemSchema", {
		description: "Gallery collection item",
	});

export type GalleryItemSchema = typeof GalleryItemSchema;

export namespace GalleryItemSchema {
	export type Type = z.infer<GalleryItemSchema>;
}

import { z } from "@hono/zod-openapi";

export const GalleryCreateSchema = z
	.object({
		userId: z.string().openapi({
			description: "ID of the user who owns the gallery",
		}),
	})
	.openapi("GalleryCreate", {
		description: "Data for creating a new gallery",
	});

export type GalleryCreateSchema = typeof GalleryCreateSchema;

export namespace GalleryCreateSchema {
	export type Type = z.infer<GalleryCreateSchema>;
}

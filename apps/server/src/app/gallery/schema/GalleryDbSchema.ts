import { z } from "@hono/zod-openapi";

export const GalleryDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the gallery",
	}),
	userId: z.string().openapi({
		description: "ID of the user who owns the gallery",
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

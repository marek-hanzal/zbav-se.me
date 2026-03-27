import { z } from "@hono/zod-openapi";

export const GalleryTableSchema = z
	.looseObject({
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
	})
	.strip();

export type GalleryTableSchema = typeof GalleryTableSchema;

export namespace GalleryTableSchema {
	export type Type = z.infer<GalleryTableSchema>;
}

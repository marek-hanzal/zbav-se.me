import { z } from "@hono/zod-openapi";

export const GalleryCreateSchema = z.record(z.string(), z.any()).openapi("GalleryCreate", {
	description: "Data for creating a new gallery",
});

export type GalleryCreateSchema = typeof GalleryCreateSchema;

export namespace GalleryCreateSchema {
	export type Type = z.infer<GalleryCreateSchema>;
}

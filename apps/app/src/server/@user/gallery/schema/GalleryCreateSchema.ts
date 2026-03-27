import { z } from "zod";

export const GalleryCreateSchema = z.record(z.string(), z.any()).meta({
	id: "GalleryCreate",
	description: "Data for creating a new gallery",
});

export type GalleryCreateSchema = typeof GalleryCreateSchema;

export namespace GalleryCreateSchema {
	export type Type = z.infer<GalleryCreateSchema>;
}

import { z } from "zod";
import { GalleryFilterSchema } from "~/public/gallery/server/schema/GalleryFilterSchema";

export const GalleryWhereSchema = z
	.looseObject({
		...GalleryFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "PublicGalleryWhere",
		description: "Public gallery app-based filters",
	});

export type GalleryWhereSchema = typeof GalleryWhereSchema;

export namespace GalleryWhereSchema {
	export type Type = z.infer<GalleryWhereSchema>;
}

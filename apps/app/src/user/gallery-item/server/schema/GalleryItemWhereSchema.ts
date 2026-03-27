import { z } from "zod";
import { GalleryItemFilterSchema } from "~/user/gallery-item/server/schema/GalleryItemFilterSchema";

export const GalleryItemWhereSchema = z
	.looseObject({
		...GalleryItemFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "GalleryItemWhere",
		description: "App-based filters",
	});

export type GalleryItemWhereSchema = typeof GalleryItemWhereSchema;

export namespace GalleryItemWhereSchema {
	export type Type = z.infer<GalleryItemWhereSchema>;
}

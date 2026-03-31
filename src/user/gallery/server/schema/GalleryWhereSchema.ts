import { z } from "zod";
import { GalleryFilterSchema } from "~/user/gallery/server/schema/GalleryFilterSchema";

export const GalleryWhereSchema = z
	.looseObject({
		...GalleryFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "GalleryWhere",
		description: "App-based filters",
	});

export type GalleryWhereSchema = typeof GalleryWhereSchema;

export namespace GalleryWhereSchema {
	export type Type = z.infer<GalleryWhereSchema>;
}

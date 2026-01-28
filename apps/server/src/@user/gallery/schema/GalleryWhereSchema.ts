import { z } from "@hono/zod-openapi";
import { GalleryFilterSchema } from "~/@user/gallery/schema/GalleryFilterSchema";

export const GalleryWhereSchema = z
	.object({
		...GalleryFilterSchema.shape,
	})
	.openapi("GalleryWhere", {
		description: "App-based filters",
	});

export type GalleryWhereSchema = typeof GalleryWhereSchema;

export namespace GalleryWhereSchema {
	export type Type = z.infer<GalleryWhereSchema>;
}

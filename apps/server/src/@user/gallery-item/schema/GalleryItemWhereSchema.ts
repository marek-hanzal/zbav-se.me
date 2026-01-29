import { z } from "@hono/zod-openapi";
import { GalleryItemFilterSchema } from "~/@user/gallery-item/schema/GalleryItemFilterSchema";

export const GalleryItemWhereSchema = z
	.object({
		...GalleryItemFilterSchema.shape,
	})
	.openapi("GalleryItemWhere", {
		description: "App-based filters",
	});

export type GalleryItemWhereSchema = typeof GalleryItemWhereSchema;

export namespace GalleryItemWhereSchema {
	export type Type = z.infer<GalleryItemWhereSchema>;
}

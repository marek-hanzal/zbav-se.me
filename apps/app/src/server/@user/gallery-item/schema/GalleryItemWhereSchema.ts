import { z } from "@hono/zod-openapi";
import { GalleryItemFilterSchema } from "~/server/@user/gallery-item/schema/GalleryItemFilterSchema";

export const GalleryItemWhereSchema = z
	.looseObject({
		...GalleryItemFilterSchema.shape,
	})
	.strip()
	.openapi("GalleryItemWhere", {
		description: "App-based filters",
	});

export type GalleryItemWhereSchema = typeof GalleryItemWhereSchema;

export namespace GalleryItemWhereSchema {
	export type Type = z.infer<GalleryItemWhereSchema>;
}

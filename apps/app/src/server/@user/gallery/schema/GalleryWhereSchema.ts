import { z } from "@hono/zod-openapi";
import { GalleryFilterSchema } from "~/server/@user/gallery/schema/GalleryFilterSchema";

export const GalleryWhereSchema = z
	.looseObject({
		...GalleryFilterSchema.shape,
	})
	.strip()
	.openapi("GalleryWhere", {
		description: "App-based filters",
	});

export type GalleryWhereSchema = typeof GalleryWhereSchema;

export namespace GalleryWhereSchema {
	export type Type = z.infer<GalleryWhereSchema>;
}

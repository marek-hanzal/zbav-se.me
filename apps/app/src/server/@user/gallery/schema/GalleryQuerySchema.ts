import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/common/schema/CursorSchema";
import { GalleryFilterSchema } from "~/server/@user/gallery/schema/GalleryFilterSchema";
import { GallerySortSchema } from "~/server/@user/gallery/schema/GallerySortSchema";
import { GalleryWhereSchema } from "~/server/@user/gallery/schema/GalleryWhereSchema";

export const GalleryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: GalleryFilterSchema.optional(),
		where: GalleryWhereSchema.optional(),
		sort: GallerySortSchema.array().optional(),
	})
	.strip()
	.openapi("GalleryQuery", {
		description: "Query object for gallery collection",
	});

export type GalleryQuerySchema = typeof GalleryQuerySchema;

export namespace GalleryQuerySchema {
	export type Type = z.infer<GalleryQuerySchema>;
}

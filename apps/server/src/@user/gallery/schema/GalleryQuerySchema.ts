import { z } from "@hono/zod-openapi";
import { GalleryFilterSchema } from "~/@user/gallery/schema/GalleryFilterSchema";
import { GallerySortSchema } from "~/@user/gallery/schema/GallerySortSchema";
import { GalleryWhereSchema } from "~/@user/gallery/schema/GalleryWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const GalleryQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: GalleryFilterSchema.optional(),
		where: GalleryWhereSchema.optional(),
		sort: GallerySortSchema.array().optional(),
	})
	.openapi("GalleryQuery", {
		description: "Query object for gallery collection",
	});

export type GalleryQuerySchema = typeof GalleryQuerySchema;

export namespace GalleryQuerySchema {
	export type Type = z.infer<GalleryQuerySchema>;
}

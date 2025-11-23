import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { GalleryFilterSchema } from "./GalleryFilterSchema";
import { GallerySortSchema } from "./GallerySortSchema";

export const GalleryQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: GalleryFilterSchema.optional(),
		where: GalleryFilterSchema.openapi("GalleryWhere", {
			description: "App-based filters",
		}).optional(),
		sort: GallerySortSchema.array().optional(),
	})
	.openapi("GalleryQuery", {
		description: "Query object for gallery collection",
	});

export type GalleryQuerySchema = typeof GalleryQuerySchema;

export namespace GalleryQuerySchema {
	export type Type = z.infer<GalleryQuerySchema>;
}

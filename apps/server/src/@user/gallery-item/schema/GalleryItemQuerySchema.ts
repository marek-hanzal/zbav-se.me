import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { GalleryItemFilterSchema } from "~/@user/gallery-item/schema/GalleryItemFilterSchema";
import { GalleryItemSortSchema } from "~/@user/gallery-item/schema/GalleryItemSortSchema";

export const GalleryItemQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: GalleryItemFilterSchema.optional(),
		where: GalleryItemFilterSchema.openapi("GalleryItemWhere", {
			description: "App-based filters",
		}).optional(),
		sort: GalleryItemSortSchema.array().optional(),
	})
	.openapi("GalleryItemQuery", {
		description: "Query object for gallery item collection",
	});

export type GalleryItemQuerySchema = typeof GalleryItemQuerySchema;

export namespace GalleryItemQuerySchema {
	export type Type = z.infer<GalleryItemQuerySchema>;
}

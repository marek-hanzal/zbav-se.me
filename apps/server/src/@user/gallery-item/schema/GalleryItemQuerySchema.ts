import { z } from "@hono/zod-openapi";
import { GalleryItemFilterSchema } from "~/@user/gallery-item/schema/GalleryItemFilterSchema";
import { GalleryItemSortSchema } from "~/@user/gallery-item/schema/GalleryItemSortSchema";
import { GalleryItemWhereSchema } from "~/@user/gallery-item/schema/GalleryItemWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const GalleryItemQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: GalleryItemFilterSchema.optional(),
		where: GalleryItemWhereSchema.optional(),
		sort: GalleryItemSortSchema.array().optional(),
	})
	.strip()
	.openapi("GalleryItemQuery", {
		description: "Query object for gallery item collection",
	});

export type GalleryItemQuerySchema = typeof GalleryItemQuerySchema;

export namespace GalleryItemQuerySchema {
	export type Type = z.infer<GalleryItemQuerySchema>;
}

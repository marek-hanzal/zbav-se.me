import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/common/schema/CursorSchema";
import { GalleryItemFilterSchema } from "~/server/@user/gallery-item/schema/GalleryItemFilterSchema";
import { GalleryItemSortSchema } from "~/server/@user/gallery-item/schema/GalleryItemSortSchema";
import { GalleryItemWhereSchema } from "~/server/@user/gallery-item/schema/GalleryItemWhereSchema";

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

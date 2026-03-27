import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { GalleryItemFilterSchema } from "~/@user/gallery-item/server/schema/GalleryItemFilterSchema";
import { GalleryItemSortSchema } from "~/@user/gallery-item/server/schema/GalleryItemSortSchema";
import { GalleryItemWhereSchema } from "~/@user/gallery-item/server/schema/GalleryItemWhereSchema";

export const GalleryItemQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: GalleryItemFilterSchema.optional(),
		where: GalleryItemWhereSchema.optional(),
		sort: GalleryItemSortSchema.array().optional(),
	})
	.strip()
	.meta({
		id: "GalleryItemQuery",
		description: "Query object for gallery item collection",
	});

export type GalleryItemQuerySchema = typeof GalleryItemQuerySchema;

export namespace GalleryItemQuerySchema {
	export type Type = z.infer<GalleryItemQuerySchema>;
}

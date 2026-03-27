import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { GalleryFilterSchema } from "~/@user/gallery/server/schema/GalleryFilterSchema";
import { GallerySortSchema } from "~/@user/gallery/server/schema/GallerySortSchema";
import { GalleryWhereSchema } from "~/@user/gallery/server/schema/GalleryWhereSchema";

export const GalleryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: GalleryFilterSchema.optional(),
		where: GalleryWhereSchema.optional(),
		sort: GallerySortSchema.array().optional(),
	})
	.strip()
	.meta({
		id: "GalleryQuery",
		description: "Query object for gallery collection",
	});

export type GalleryQuerySchema = typeof GalleryQuerySchema;

export namespace GalleryQuerySchema {
	export type Type = z.infer<GalleryQuerySchema>;
}

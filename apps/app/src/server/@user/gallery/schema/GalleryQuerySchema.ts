import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
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
	.meta({
		id: "GalleryQuery",
		description: "Query object for gallery collection",
	});

export type GalleryQuerySchema = typeof GalleryQuerySchema;

export namespace GalleryQuerySchema {
	export type Type = z.infer<GalleryQuerySchema>;
}

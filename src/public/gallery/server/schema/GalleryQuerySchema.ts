import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { GalleryFilterSchema } from "~/public/gallery/server/schema/GalleryFilterSchema";
import { GallerySortSchema } from "~/public/gallery/server/schema/GallerySortSchema";
import { GalleryWhereSchema } from "~/public/gallery/server/schema/GalleryWhereSchema";

export const GalleryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.default({
			page: 0,
			size: 10,
		}).optional(),
		filter: GalleryFilterSchema.optional(),
		where: GalleryWhereSchema.optional(),
		sort: GallerySortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description: "Guardrail limit for collection size",
		}),
	})
	.strip()
	.meta({
		id: "PublicGalleryQuery",
		description: "Query object for public gallery collection",
	});

export type GalleryQuerySchema = typeof GalleryQuerySchema;

export namespace GalleryQuerySchema {
	export type Type = z.infer<GalleryQuerySchema>;
}

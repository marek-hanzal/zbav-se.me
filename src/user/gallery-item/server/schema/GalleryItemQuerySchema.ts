import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { GalleryItemFilterSchema } from "~/user/gallery-item/server/schema/GalleryItemFilterSchema";
import { GalleryItemSortSchema } from "~/user/gallery-item/server/schema/GalleryItemSortSchema";
import { GalleryItemWhereSchema } from "~/user/gallery-item/server/schema/GalleryItemWhereSchema";

export const GalleryItemQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: GalleryItemFilterSchema.optional(),
		where: GalleryItemWhereSchema.optional(),
		sort: GalleryItemSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
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

import { z } from "zod";
import { GalleryItemSchema } from "~/server/@user/gallery-item/schema/GalleryItemSchema";
import { GalleryTableSchema } from "~/server/database/@table/GalleryTableSchema";

export const GallerySchema = z
	.looseObject({
		...GalleryTableSchema.shape,
		items: z.array(GalleryItemSchema).meta({
			description: "Gallery items sorted by sort order",
		}),
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.strip()
	.meta({
		id: "Gallery",
		description: "Gallery data with items",
	});

export type GallerySchema = typeof GallerySchema;

export namespace GallerySchema {
	export type Type = z.infer<GallerySchema>;
}

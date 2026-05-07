import { z } from "zod";
import { GalleryTableSchema } from "~/server/database/@table/GalleryTableSchema";
import { GalleryItemSchema } from "~/user/gallery-item/server/schema/GalleryItemSchema";

export const GallerySchema = z
	.looseObject({
		...GalleryTableSchema.shape,
		items: z.array(GalleryItemSchema).meta({
			description: "Gallery items sorted by sort order",
		}),
	})
	.omit({
		userId: true,
		access: true,
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

import { z } from "zod";
import { GalleryItemSchema } from "~/public/gallery-item/server/schema/GalleryItemSchema";
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
	})
	.strip()
	.meta({
		id: "PublicGallery",
		description: "Public gallery data with items",
	});

export type GallerySchema = typeof GallerySchema;

export namespace GallerySchema {
	export type Type = z.infer<GallerySchema>;
}

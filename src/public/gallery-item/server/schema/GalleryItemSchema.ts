import { z } from "zod";
import { UploadSchema } from "~/public/upload/server/schema/UploadSchema";
import { GalleryItemTableSchema } from "~/server/database/@table/GalleryItemTableSchema";

export const GalleryItemSchema = z
	.looseObject({
		...GalleryItemTableSchema.shape,
		upload: UploadSchema,
	})
	.strip()
	.meta({
		id: "PublicGalleryItem",
		description: "Public gallery item data",
	});

export type GalleryItemSchema = typeof GalleryItemSchema;

export namespace GalleryItemSchema {
	export type Type = z.infer<GalleryItemSchema>;
}

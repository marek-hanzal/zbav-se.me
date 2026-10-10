import { z } from "zod";
import { GalleryItemTableSchema } from "~/database/schema/GalleryItemTableSchema";
import { UploadSchema } from "~/public-upload/schema/UploadSchema";

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

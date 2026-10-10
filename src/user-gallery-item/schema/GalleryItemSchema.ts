import { z } from "zod";
import { GalleryItemTableSchema } from "~/database/schema/GalleryItemTableSchema";
import { UploadSchema } from "~/user-upload/schema/UploadSchema";

export const GalleryItemSchema = z
	.looseObject({
		...GalleryItemTableSchema.shape,
		upload: UploadSchema,
	})
	.omit({
		createdAt: true,
	})
	.strip()
	.meta({
		id: "GalleryItem",
		description: "Gallery item data",
	});

export type GalleryItemSchema = typeof GalleryItemSchema;

export namespace GalleryItemSchema {
	export type Type = z.infer<GalleryItemSchema>;
}

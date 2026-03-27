import { z } from "zod";
import { UploadSchema } from "~/client/@user/upload/server/schema/UploadSchema";
import { GalleryItemTableSchema } from "~/server/database/@table/GalleryItemTableSchema";

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

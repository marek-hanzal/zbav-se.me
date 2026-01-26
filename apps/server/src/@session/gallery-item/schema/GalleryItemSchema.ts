import { z } from "@hono/zod-openapi";
import { UploadSchema } from "~/@user/upload/schema/UploadSchema";
import { GalleryItemTableSchema } from "~/database/@table/GalleryItemTableSchema";

export const GalleryItemSchema = z
	.looseObject({
		...GalleryItemTableSchema.shape,
		upload: UploadSchema,
	})
	.omit({
		createdAt: true,
	})
	.strip()
	.openapi("GalleryItem", {
		description: "Gallery item data",
	});

export type GalleryItemSchema = typeof GalleryItemSchema;

export namespace GalleryItemSchema {
	export type Type = z.infer<GalleryItemSchema>;
}

import { z } from "@hono/zod-openapi";
import { UploadSchema } from "~/@user/upload/schema/UploadSchema";
import { GalleryItemDbSchema } from "~/app/gallery-item/schema/GalleryItemDbSchema";

export const GalleryItemSchema = z
	.object({
		...GalleryItemDbSchema.shape,
		upload: UploadSchema,
	})
	.omit({
		createdAt: true,
	})
	.openapi("GalleryItem", {
		description: "Gallery item data",
	});

export type GalleryItemSchema = typeof GalleryItemSchema;

export namespace GalleryItemSchema {
	export type Type = z.infer<GalleryItemSchema>;
}

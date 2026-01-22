import { z } from "@hono/zod-openapi";
import { UploadSchema } from "~/@user/upload/schema/UploadSchema";
import { GalleryItemDbSchema } from "./GalleryItemDbSchema";

export const GalleryItemSchema = z
	.looseObject({
		...GalleryItemDbSchema.shape,
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

import { z } from "@hono/zod-openapi";
import { GalleryItemDbSchema } from "../../../app/gallery-item/schema/GalleryItemDbSchema";
import { UploadSchema } from "../../upload/schema/UploadSchema";

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

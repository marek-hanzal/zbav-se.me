import { z } from "@hono/zod-openapi";
import { GalleryDbSchema } from "../../../app/gallery/schema/GalleryDbSchema";
import { UploadSchema } from "../../upload/schema/UploadSchema";

export const GallerySchema = z
	.object({
		...GalleryDbSchema.shape,
		upload: UploadSchema,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.openapi("Gallery", {
		description: "Gallery data",
	});

export type GallerySchema = typeof GallerySchema;

export namespace GallerySchema {
	export type Type = z.infer<GallerySchema>;
}

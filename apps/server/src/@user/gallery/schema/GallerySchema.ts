import { z } from "@hono/zod-openapi";
import { GalleryItemSchema } from "~/@user/gallery-item/schema/GalleryItemSchema";
import { GalleryTableSchema } from "~/database/@table/GalleryTableSchema";

export const GallerySchema = z
	.looseObject({
		...GalleryTableSchema.shape,
		items: z.array(GalleryItemSchema).openapi({
			description: "Gallery items sorted by sort order",
		}),
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.strip()
	.openapi("Gallery", {
		description: "Gallery data with items",
	});

export type GallerySchema = typeof GallerySchema;

export namespace GallerySchema {
	export type Type = z.infer<GallerySchema>;
}

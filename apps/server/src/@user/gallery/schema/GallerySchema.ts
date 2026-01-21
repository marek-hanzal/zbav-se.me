import { z } from "@hono/zod-openapi";
import { GalleryItemSchema } from "~/@user/gallery-item/schema/GalleryItemSchema";
import { GalleryDbSchema } from "~/app/gallery/schema/GalleryDbSchema";

export const GallerySchema = z
	.looseObject({
		...GalleryDbSchema.shape,
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

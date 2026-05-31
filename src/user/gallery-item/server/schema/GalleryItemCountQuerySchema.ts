import { z } from "zod";
import { GalleryItemQuerySchema } from "~/user/gallery-item/server/schema/GalleryItemQuerySchema";

export const GalleryItemCountQuerySchema = z
	.looseObject({
		...GalleryItemQuerySchema.pick({
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "GalleryItemCountQuery",
		description: "Query object for gallery item count",
	});

export type GalleryItemCountQuerySchema = typeof GalleryItemCountQuerySchema;

export namespace GalleryItemCountQuerySchema {
	export type Type = z.infer<GalleryItemCountQuerySchema>;
}

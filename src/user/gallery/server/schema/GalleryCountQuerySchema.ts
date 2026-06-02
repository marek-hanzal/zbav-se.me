import { z } from "zod";
import { GalleryQuerySchema } from "~/user/gallery/server/schema/GalleryQuerySchema";

export const GalleryCountQuerySchema = z
	.looseObject({
		...GalleryQuerySchema.pick({
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "GalleryCountQuery",
		description: "Query object for gallery count",
	});

export type GalleryCountQuerySchema = typeof GalleryCountQuerySchema;

export namespace GalleryCountQuerySchema {
	export type Type = z.infer<GalleryCountQuerySchema>;
}

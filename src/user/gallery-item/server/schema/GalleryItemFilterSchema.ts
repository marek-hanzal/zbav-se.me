import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const GalleryItemFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "Exact user id (access checked via parent gallery)",
		}),
		galleryId: z.string().optional().meta({
			description: "Exact gallery id",
		}),
	})
	.strip()
	.meta({
		id: "GalleryItemFilter",
		description: "Filter object for gallery item collection",
	});

export type GalleryItemFilterSchema = typeof GalleryItemFilterSchema;

export namespace GalleryItemFilterSchema {
	export type Type = z.infer<GalleryItemFilterSchema>;
}

import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const GalleryFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "Exact user id",
		}),
	})
	.strip()
	.meta({
		id: "GalleryFilter",
		description: "Filter object for gallery collection",
	});

export type GalleryFilterSchema = typeof GalleryFilterSchema;

export namespace GalleryFilterSchema {
	export type Type = z.infer<GalleryFilterSchema>;
}

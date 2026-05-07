import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const GalleryFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
	})
	.strip()
	.meta({
		id: "PublicGalleryFilter",
		description: "Public gallery filters",
	});

export type GalleryFilterSchema = typeof GalleryFilterSchema;

export namespace GalleryFilterSchema {
	export type Type = z.infer<GalleryFilterSchema>;
}

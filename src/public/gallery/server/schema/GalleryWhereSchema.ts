import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const GalleryWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
	})
	.strip()
	.meta({
		id: "PublicGalleryWhere",
		description: "Public gallery app-based filters",
	});

export type GalleryWhereSchema = typeof GalleryWhereSchema;

export namespace GalleryWhereSchema {
	export type Type = z.infer<GalleryWhereSchema>;
}

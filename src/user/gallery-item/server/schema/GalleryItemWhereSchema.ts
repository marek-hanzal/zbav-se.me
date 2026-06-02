import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const GalleryItemWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		userId: z.string().optional().meta({
			description: "Exact user id (access checked via parent gallery)",
		}),
		galleryId: z.string().optional().meta({
			description: "Exact gallery id",
		}),
	})
	.strip()
	.meta({
		id: "GalleryItemWhere",
		description: "App-based filters",
	});

export type GalleryItemWhereSchema = typeof GalleryItemWhereSchema;

export namespace GalleryItemWhereSchema {
	export type Type = z.infer<GalleryItemWhereSchema>;
}

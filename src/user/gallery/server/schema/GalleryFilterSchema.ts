import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { AccessEnumSchema } from "~/common/access/AccessEnumSchema";

export const GalleryFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "Exact user id",
		}),
		access: AccessEnumSchema.optional().meta({
			description: "Exact gallery visibility",
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

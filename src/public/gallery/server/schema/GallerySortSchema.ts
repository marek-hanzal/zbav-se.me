import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const GallerySortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.meta({
				id: "PublicGallerySortField",
				description: "Field of the public gallery sort",
			}),
		order: OrderEnumSchema,
	})
	.meta({
		id: "PublicGallerySort",
		description: "Sort object for public gallery collection",
	});

export type GallerySortSchema = typeof GallerySortSchema;

export namespace GallerySortSchema {
	export type Type = z.infer<GallerySortSchema>;
}

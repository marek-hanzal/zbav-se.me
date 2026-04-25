import { z } from "zod";
import { AccessEnumSchema } from "~/common/access/AccessEnumSchema";

export const GalleryCreateSchema = z
	.looseObject({
		access: AccessEnumSchema.meta({
			description: "Visibility of the gallery",
		}),
	})
	.strip()
	.meta({
		id: "GalleryCreate",
		description: "Data for creating a new gallery",
	});

export type GalleryCreateSchema = typeof GalleryCreateSchema;

export namespace GalleryCreateSchema {
	export type Type = z.infer<GalleryCreateSchema>;
}

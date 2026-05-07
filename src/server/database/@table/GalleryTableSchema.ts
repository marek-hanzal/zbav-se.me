import { z } from "zod";
import { AccessEnumSchema } from "~/common/access/AccessEnumSchema";

export const GalleryTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the gallery",
		}),
		userId: z.string().meta({
			description: "ID of the user who owns the gallery",
		}),
		access: AccessEnumSchema.meta({
			description: "Visibility of the gallery",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "GalleryTable",
		description: "Database row for a gallery.",
	})
	.strip();

export type GalleryTableSchema = typeof GalleryTableSchema;

export namespace GalleryTableSchema {
	export type Type = z.infer<GalleryTableSchema>;
}

import { z } from "zod";
import { AccessEnumSchema } from "~/common/access/AccessEnumSchema";
import { WhereSchema } from "~/query/schema/WhereSchema";

export const GalleryWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		userId: z.string().optional().meta({
			description: "Exact user id",
		}),
		access: AccessEnumSchema.optional().meta({
			description: "Exact gallery visibility",
		}),
	})
	.strip()
	.meta({
		id: "GalleryWhere",
		description: "App-based filters",
	});

export type GalleryWhereSchema = typeof GalleryWhereSchema;

export namespace GalleryWhereSchema {
	export type Type = z.infer<GalleryWhereSchema>;
}

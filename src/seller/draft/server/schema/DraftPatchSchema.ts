import { z } from "zod";
import { DraftQuerySchema } from "~/seller/draft/server/schema/DraftQuerySchema";
import { DraftTableSchema } from "~/server/database/@table/DraftTableSchema";

export const DraftPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...DraftTableSchema.shape,
			})
			.omit({
				id: true,
				userId: true,
				currency: true,
				createdAt: true,
				updatedAt: true,
				withImageUrl: true,
			})
			.partial()
			.strip()
			.meta({
				id: "DraftPatchData",
				description: "Fields to update (all optional)",
			}),
		query: DraftQuerySchema,
	})
	.strip()
	.meta({
		id: "DraftPatch",
		description: "Data for updating an existing draft",
	});

export type DraftPatchSchema = typeof DraftPatchSchema;

export namespace DraftPatchSchema {
	export type Type = z.infer<DraftPatchSchema>;
}

import { z } from "@hono/zod-openapi";
import { DraftQuerySchema } from "~/@seller/draft/schema/DraftQuerySchema";
import { DraftTableSchema } from "~/database/@table/DraftTableSchema";

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
			})
			.partial()
			.strip()
			.openapi("DraftPatchData", {
				description: "Fields to update (all optional)",
			}),
		query: DraftQuerySchema,
	})
	.strip()
	.openapi("DraftPatch", {
		description: "Data for updating an existing draft",
	});

export type DraftPatchSchema = typeof DraftPatchSchema;

export namespace DraftPatchSchema {
	export type Type = z.infer<DraftPatchSchema>;
}

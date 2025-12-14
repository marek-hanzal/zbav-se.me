import { z } from "@hono/zod-openapi";
import { DraftDbSchema } from "~/app/draft/schema/DraftDbSchema";
import { DraftQuerySchema } from "~/app/draft/schema/DraftQuerySchema";

export const DraftPatchSchema = z
	.object({
		patch: z
			.object({
				...DraftDbSchema.shape,
			})
			.omit({
				id: true,
				userId: true,
				createdAt: true,
				updatedAt: true,
			})
			.partial()
			.openapi({
				description: "Fields to update (all optional)",
			}),
		query: DraftQuerySchema,
	})
	.openapi("DraftPatch", {
		description: "Data for updating an existing draft",
	});

export type DraftPatchSchema = typeof DraftPatchSchema;

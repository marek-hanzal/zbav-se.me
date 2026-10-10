import { z } from "zod";
import { AgentThreadTableSchema } from "~/database/schema/AgentThreadTableSchema";
import { AgentThreadQuerySchema } from "~/user-agent/schema/AgentThreadQuerySchema";

export const AgentThreadPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...AgentThreadTableSchema.shape,
			})
			.omit({
				id: true,
				userId: true,
				createdAt: true,
				updatedAt: true,
			})
			.partial()
			.strip()
			.meta({
				id: "AgentThreadPatchData",
				description: "Fields to update (all optional)",
			}),
		query: AgentThreadQuerySchema,
	})
	.strip()
	.meta({
		id: "AgentThreadPatch",
		description: "Data for updating an existing agent thread",
	});

export type AgentThreadPatchSchema = typeof AgentThreadPatchSchema;

export namespace AgentThreadPatchSchema {
	export type Type = z.infer<AgentThreadPatchSchema>;
}

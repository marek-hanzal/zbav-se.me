import { z } from "zod";
import { WhereSchema } from "~/query/schema/WhereSchema";

export const AgentThreadWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		userId: z.string().optional().meta({
			description: "Exact user id",
		}),
		archivedAt: z
			.enum([
				"archived",
				"active",
				"any",
			])
			.optional()
			.meta({
				id: "AgentThreadArchivedAtFilter",
				description: "Filter by archive state",
			}),
	})
	.strip()
	.meta({
		id: "AgentThreadWhere",
		description: "App-based filters",
	});

export type AgentThreadWhereSchema = typeof AgentThreadWhereSchema;

export namespace AgentThreadWhereSchema {
	export type Type = z.infer<AgentThreadWhereSchema>;
}

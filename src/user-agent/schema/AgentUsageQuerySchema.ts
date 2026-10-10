import { z } from "zod";
import { CursorSchema } from "~/query/schema/CursorSchema";
import { AgentUsageSortSchema } from "~/user-agent/schema/AgentUsageSortSchema";
import { AgentUsageWhereSchema } from "~/user-agent/schema/AgentUsageWhereSchema";

export const AgentUsageQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		where: AgentUsageWhereSchema.optional(),
		sort: AgentUsageSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "AgentUsageQuery",
		description: "Query object for agent usage collection",
	});

export type AgentUsageQuerySchema = typeof AgentUsageQuerySchema;

export namespace AgentUsageQuerySchema {
	export type Type = z.infer<AgentUsageQuerySchema>;
}

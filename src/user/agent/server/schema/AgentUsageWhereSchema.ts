import { z } from "zod";
import { AgentUsageFilterSchema } from "~/user/agent/server/schema/AgentUsageFilterSchema";

export const AgentUsageWhereSchema = z
	.looseObject({
		...AgentUsageFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "AgentUsageWhere",
		description: "App-based filters",
	});

export type AgentUsageWhereSchema = typeof AgentUsageWhereSchema;

export namespace AgentUsageWhereSchema {
	export type Type = z.infer<AgentUsageWhereSchema>;
}

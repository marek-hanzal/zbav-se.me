import type { z } from "zod";
import { AgentUsageTableSchema } from "~/server/database/@table/AgentUsageTableSchema";

export const AgentUsageSchema = AgentUsageTableSchema.strip().meta({
	id: "AgentUsage",
	description: "Agent usage data",
});

export type AgentUsageSchema = typeof AgentUsageSchema;

export namespace AgentUsageSchema {
	export type Type = z.infer<AgentUsageSchema>;
}

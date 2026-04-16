import { z } from "zod";

export const AgentUsageTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the agent usage row",
		}),
		userId: z.string().meta({
			description: "ID of the user",
		}),
		threadId: z.string().meta({
			description: "ID of the agent thread",
		}),
		requests: z.number().int().meta({
			description: "Number of requests in the usage summary",
		}),
		input: z.number().int().meta({
			description: "Input amount in the usage summary",
		}),
		total: z.number().int().meta({
			description: "Total amount in the usage summary",
		}),
		output: z.number().int().meta({
			description: "Output amount in the usage summary",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "AgentUsageTable",
		description: "Database row for agent usage.",
	})
	.strip();

export type AgentUsageTableSchema = typeof AgentUsageTableSchema;

export namespace AgentUsageTableSchema {
	export type Type = z.infer<AgentUsageTableSchema>;
}

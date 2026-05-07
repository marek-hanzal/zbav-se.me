import { z } from "zod";

export const AgentUsageCreateSchema = z
	.looseObject({
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
	})
	.strip()
	.meta({
		id: "AgentUsageCreate",
		description: "Data for creating agent usage",
	});

export type AgentUsageCreateSchema = typeof AgentUsageCreateSchema;

export namespace AgentUsageCreateSchema {
	export type Type = z.infer<AgentUsageCreateSchema>;
}

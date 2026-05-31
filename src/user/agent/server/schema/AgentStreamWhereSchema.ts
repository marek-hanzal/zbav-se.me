import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const AgentStreamWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		userId: z.string().optional().meta({
			description: "Exact user id",
		}),
		threadId: z.string().optional().meta({
			description: "Exact thread id",
		}),
	})
	.strip()
	.meta({
		id: "AgentStreamWhere",
		description: "App-based filters",
	});

export type AgentStreamWhereSchema = typeof AgentStreamWhereSchema;

export namespace AgentStreamWhereSchema {
	export type Type = z.infer<AgentStreamWhereSchema>;
}

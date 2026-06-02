import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const AgentUsageWhereSchema = z
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
		id: "AgentUsageWhere",
		description: "App-based filters",
	});

export type AgentUsageWhereSchema = typeof AgentUsageWhereSchema;

export namespace AgentUsageWhereSchema {
	export type Type = z.infer<AgentUsageWhereSchema>;
}

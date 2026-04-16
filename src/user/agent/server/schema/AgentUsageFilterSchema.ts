import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const AgentUsageFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "Exact user id",
		}),
		threadId: z.string().optional().meta({
			description: "Exact thread id",
		}),
	})
	.strip()
	.meta({
		id: "AgentUsageFilter",
		description: "Filter object for agent usage collection",
	});

export type AgentUsageFilterSchema = typeof AgentUsageFilterSchema;

export namespace AgentUsageFilterSchema {
	export type Type = z.infer<AgentUsageFilterSchema>;
}

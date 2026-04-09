import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const AgentStreamFilterSchema = z
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
		id: "AgentStreamFilter",
		description: "Filter object for agent stream collection",
	});

export type AgentStreamFilterSchema = typeof AgentStreamFilterSchema;

export namespace AgentStreamFilterSchema {
	export type Type = z.infer<AgentStreamFilterSchema>;
}

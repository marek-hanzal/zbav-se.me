import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { AgentStreamFilterSchema } from "~/user/agent/server/schema/AgentStreamFilterSchema";
import { AgentStreamSortSchema } from "~/user/agent/server/schema/AgentStreamSortSchema";
import { AgentStreamWhereSchema } from "~/user/agent/server/schema/AgentStreamWhereSchema";

export const AgentStreamQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: AgentStreamFilterSchema.optional(),
		where: AgentStreamWhereSchema.optional(),
		sort: AgentStreamSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "AgentStreamQuery",
		description: "Query object for agent stream collection",
	});

export type AgentStreamQuerySchema = typeof AgentStreamQuerySchema;

export namespace AgentStreamQuerySchema {
	export type Type = z.infer<AgentStreamQuerySchema>;
}

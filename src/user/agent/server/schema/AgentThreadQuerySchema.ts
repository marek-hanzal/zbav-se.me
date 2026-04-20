import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { AgentThreadFilterSchema } from "~/user/agent/server/schema/AgentThreadFilterSchema";
import { AgentThreadSortSchema } from "~/user/agent/server/schema/AgentThreadSortSchema";
import { AgentThreadWhereSchema } from "~/user/agent/server/schema/AgentThreadWhereSchema";

export const AgentThreadQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: AgentThreadFilterSchema.optional(),
		where: AgentThreadWhereSchema.optional(),
		sort: AgentThreadSortSchema.array().optional(),
		limit: z.int().optional().meta({
			description: "Hard cap on the result size",
		}),
	})
	.strip()
	.meta({
		id: "AgentThreadQuery",
		description: "Query for agent thread data",
	});

export type AgentThreadQuerySchema = typeof AgentThreadQuerySchema;

export namespace AgentThreadQuerySchema {
	export type Type = z.infer<AgentThreadQuerySchema>;
}

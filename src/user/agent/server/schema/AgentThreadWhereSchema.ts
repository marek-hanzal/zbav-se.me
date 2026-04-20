import { z } from "zod";
import { AgentThreadFilterSchema } from "~/user/agent/server/schema/AgentThreadFilterSchema";

export const AgentThreadWhereSchema = z
	.looseObject({
		...AgentThreadFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "AgentThreadWhere",
		description: "App-based filters",
	});

export type AgentThreadWhereSchema = typeof AgentThreadWhereSchema;

export namespace AgentThreadWhereSchema {
	export type Type = z.infer<AgentThreadWhereSchema>;
}

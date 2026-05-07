import { z } from "zod";
import { AgentStreamFilterSchema } from "~/user/agent/server/schema/AgentStreamFilterSchema";

export const AgentStreamWhereSchema = z
	.looseObject({
		...AgentStreamFilterSchema.shape,
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

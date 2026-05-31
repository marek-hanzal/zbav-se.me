import { z } from "zod";
import { AgentThreadQuerySchema } from "~/user/agent/server/schema/AgentThreadQuerySchema";

export const AgentThreadCountQuerySchema = z
	.looseObject({
		...AgentThreadQuerySchema.pick({
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "AgentThreadCountQuery",
		description: "Query object for agent thread count",
	});

export type AgentThreadCountQuerySchema = typeof AgentThreadCountQuerySchema;

export namespace AgentThreadCountQuerySchema {
	export type Type = z.infer<AgentThreadCountQuerySchema>;
}

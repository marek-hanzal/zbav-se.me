import type { z } from "zod";
import { AgentThreadTableSchema } from "~/server/database/@table/AgentThreadTableSchema";

export const AgentThreadSchema = AgentThreadTableSchema.omit({
	userId: true,
})
	.strip()
	.meta({
		id: "AgentThread",
		description: "Agent thread data",
	});

export type AgentThreadSchema = typeof AgentThreadSchema;

export namespace AgentThreadSchema {
	export type Type = z.infer<AgentThreadSchema>;
}

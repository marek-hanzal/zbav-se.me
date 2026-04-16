import type { z } from "zod";
import { AgentStreamTableSchema } from "~/server/database/@table/AgentStreamTableSchema";

export const AgentStreamSchema = AgentStreamTableSchema.strip().meta({
	id: "AgentStream",
	description: "Agent stream data",
});

export type AgentStreamSchema = typeof AgentStreamSchema;

export namespace AgentStreamSchema {
	export type Type = z.infer<AgentStreamSchema>;
}

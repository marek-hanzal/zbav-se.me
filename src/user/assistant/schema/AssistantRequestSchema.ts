import type { AgentInputItem } from "@openai/agents-core";
import { z } from "zod";

export const AssistantRequestSchema: z.ZodType<string | AgentInputItem[]> = z
	.union([
		z.string(),
		z.array(z.unknown()).transform((items) => items as AgentInputItem[]),
	])
	.meta({
		id: "AssistantRequest",
		description: "Request body accepted by the assistant streaming endpoint",
	});

export type AssistantRequestSchema = typeof AssistantRequestSchema;

export namespace AssistantRequestSchema {
	export type Type = z.infer<AssistantRequestSchema>;
}

import { z } from "zod";
import type { AssistantChatPartTypeEnumSchema } from "~/user/assistant/schema/part/AssistantChatPartTypeEnumSchema";

export const AssistantChatToolCallPartSchema = z
	.object({
		id: z.string(),
		type: z.literal("tool_call" satisfies AssistantChatPartTypeEnumSchema.Type),
		toolName: z.string(),
		status: z.enum([
			"in_progress",
			"completed",
			"incomplete",
		]),
		input: z.string(),
		output: z.string(),
	})
	.meta({
		id: "AssistantChatToolCallPart",
		description: "Tool call part rendered inside assistant chat",
	});

export type AssistantChatToolCallPartSchema = typeof AssistantChatToolCallPartSchema;

export namespace AssistantChatToolCallPartSchema {
	export type Type = z.infer<AssistantChatToolCallPartSchema>;
}

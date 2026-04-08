import { z } from "zod";
import type { AssistantChatPartTypeEnumSchema } from "~/user/assistant/schema/part/AssistantChatPartTypeEnumSchema";

export const AssistantChatReasoningPartSchema = z
	.object({
		id: z.string(),
		type: z.literal("reasoning" satisfies AssistantChatPartTypeEnumSchema.Type),
		text: z.string(),
	})
	.meta({
		id: "AssistantChatReasoningPart",
		description: "Reasoning part rendered inside assistant chat",
	});

export type AssistantChatReasoningPartSchema = typeof AssistantChatReasoningPartSchema;

export namespace AssistantChatReasoningPartSchema {
	export type Type = z.infer<AssistantChatReasoningPartSchema>;
}

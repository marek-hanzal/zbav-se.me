import { z } from "zod";
import type { AssistantChatPartTypeEnumSchema } from "~/user/assistant/schema/part/AssistantChatPartTypeEnumSchema";

export const AssistantChatTextPartSchema = z
	.object({
		id: z.string(),
		type: z.literal("text" satisfies AssistantChatPartTypeEnumSchema.Type),
		text: z.string(),
	})
	.meta({
		id: "AssistantChatTextPart",
		description: "Text part rendered inside assistant chat",
	});

export type AssistantChatTextPartSchema = typeof AssistantChatTextPartSchema;

export namespace AssistantChatTextPartSchema {
	export type Type = z.infer<AssistantChatTextPartSchema>;
}

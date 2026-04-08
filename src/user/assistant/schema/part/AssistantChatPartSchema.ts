import { z } from "zod";
import { AssistantChatReasoningPartSchema } from "~/user/assistant/schema/part/AssistantChatReasoningPartSchema";
import { AssistantChatTextPartSchema } from "~/user/assistant/schema/part/AssistantChatTextPartSchema";
import { AssistantChatToolCallPartSchema } from "~/user/assistant/schema/part/AssistantChatToolCallPartSchema";

export const AssistantChatPartSchema = z
	.discriminatedUnion("type", [
		AssistantChatTextPartSchema,
		AssistantChatReasoningPartSchema,
		AssistantChatToolCallPartSchema,
	])
	.meta({
		id: "AssistantChatPart",
		description: "Single renderable part of an assistant chat message",
	});

export type AssistantChatPartSchema = typeof AssistantChatPartSchema;

export namespace AssistantChatPartSchema {
	export type Type = z.infer<AssistantChatPartSchema>;
}

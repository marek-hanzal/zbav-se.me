import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import type { AssistantChatPartSchema } from "~/user/assistant/schema/part/AssistantChatPartSchema";

export interface MutableAssistantMessage extends AssistantChatMessageSchema.Type {
	parts: AssistantChatPartSchema.Type[];
}

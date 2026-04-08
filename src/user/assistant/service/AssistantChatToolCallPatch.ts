import type { AssistantChatToolCallPartSchema } from "~/user/assistant/schema/part/AssistantChatToolCallPartSchema";

export interface AssistantChatToolCallPatch {
	id: string;
	toolName?: string;
	status?: AssistantChatToolCallPartSchema.Type["status"];
	input?: string;
	output?: string;
}

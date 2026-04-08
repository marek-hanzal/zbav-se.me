import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";

export namespace createAssistantChatMessage {
	export interface Props extends Pick<AssistantChatMessageSchema.Type, "id" | "role"> {
		//
	}
}

export const createAssistantChatMessage = ({
	id,
	role,
}: createAssistantChatMessage.Props): AssistantChatMessageSchema.Type => {
	return {
		id,
		role,
		parts: [],
	};
};

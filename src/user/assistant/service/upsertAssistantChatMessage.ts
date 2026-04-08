import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";

export namespace upsertAssistantChatMessage {
	export interface Props {
		messages: AssistantChatMessageSchema.Type[];
		message: AssistantChatMessageSchema.Type;
	}
}

export const upsertAssistantChatMessage = ({
	messages,
	message,
}: upsertAssistantChatMessage.Props): AssistantChatMessageSchema.Type[] => {
	const index = messages.findIndex((item) => item.id === message.id);

	if (index === -1) {
		return [
			...messages,
			message,
		];
	}

	return messages.map((item, itemIndex) => {
		return itemIndex === index ? message : item;
	});
};

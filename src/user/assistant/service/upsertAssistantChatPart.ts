import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import type { AssistantChatPartSchema } from "~/user/assistant/schema/part/AssistantChatPartSchema";

export namespace upsertAssistantChatPart {
	export interface Props {
		message: AssistantChatMessageSchema.Type;
		part: AssistantChatPartSchema.Type;
	}
}

export const upsertAssistantChatPart = ({
	message,
	part,
}: upsertAssistantChatPart.Props): AssistantChatMessageSchema.Type => {
	const index = message.parts.findIndex((item) => item.id === part.id);

	if (index === -1) {
		return {
			...message,
			parts: [
				...message.parts,
				part,
			],
		};
	}

	return {
		...message,
		parts: message.parts.map((item, itemIndex) => {
			return itemIndex === index ? part : item;
		}),
	};
};

import type { MutableAssistantMessage } from "./MutableAssistantMessage";

export namespace ensureAssistantMessage {
	export interface Props {
		messages: MutableAssistantMessage[];
		id: string;
	}
}

export const ensureAssistantMessage = ({
	messages,
	id,
}: ensureAssistantMessage.Props): MutableAssistantMessage => {
	const lastMessage = messages.at(-1);

	if (lastMessage?.role === "assistant") {
		return lastMessage;
	}

	const message: MutableAssistantMessage = {
		id,
		role: "assistant",
		parts: [],
	};

	messages.push(message);

	return message;
};

import type { ResponseOutputMessage } from "openai/resources/responses/responses";

export const createAgentLiveAssistantMessage = ({
	itemId,
}: {
	itemId: string;
}): ResponseOutputMessage => {
	return {
		id: itemId,
		type: "message",
		role: "assistant",
		status: "in_progress",
		content: [],
	};
};

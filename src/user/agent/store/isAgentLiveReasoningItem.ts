import type {
	ResponseOutputItem,
	ResponseReasoningItem,
} from "openai/resources/responses/responses";

export const isAgentLiveReasoningItem = (
	item: ResponseOutputItem,
): item is ResponseReasoningItem => {
	return item.type === "reasoning";
};

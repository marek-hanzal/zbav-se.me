import type { AgentLiveVisualItem } from "./AgentLiveVisualItem";

export const isAgentLiveSlotRenderable = (item: AgentLiveVisualItem.Value | undefined): boolean => {
	if (!item) {
		return false;
	}

	if (item.type === "message" && item.role === "assistant") {
		return item.content.length > 0;
	}

	return true;
};

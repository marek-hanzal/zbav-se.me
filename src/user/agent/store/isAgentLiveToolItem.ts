import type { AgentLiveVisualItem } from "./AgentLiveVisualItem";

export const isAgentLiveToolItem = (item: AgentLiveVisualItem.Value | undefined): boolean => {
	if (!item) {
		return false;
	}

	return (
		item.type === "function_call" ||
		item.type === "function_call_output" ||
		item.type === "tool_search_call" ||
		item.type === "tool_search_output"
	);
};

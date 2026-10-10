import type { FunctionCallResultItem, RunStreamEvent } from "@openai/agents";

export function getFunctionCallResultItem(event: RunStreamEvent): FunctionCallResultItem | null {
	if (
		event.type !== "run_item_stream_event" ||
		event.name !== "tool_output" ||
		event.item.rawItem.type !== "function_call_result"
	) {
		return null;
	}

	return event.item.rawItem;
}

import {
	type FunctionCallResultItem,
	isOpenAIResponsesRawModelStreamEvent,
	type OpenAIResponsesRawModelStreamEvent,
	type RunStreamEvent,
} from "@openai/agents";

/**
 * A little bit hacky way how to get all event stuff from the official SDK.
 *
 * We're doing this, because server is sending us those events, so this little
 * type is a contract between SSE and UI.
 */
export type { OpenAIResponsesRawModelStreamEvent, RunStreamEvent };

export function getResponseStreamEvent(
	event: RunStreamEvent,
): OpenAIResponsesRawModelStreamEvent["data"]["event"] | null {
	if (!isOpenAIResponsesRawModelStreamEvent(event)) {
		return null;
	}

	return event.data.event;
}

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

import { isOpenAIResponsesRawModelStreamEvent, type RunStreamEvent } from "@openai/agents";

export function getResponseStreamEventFn(event: RunStreamEvent) {
	if (!isOpenAIResponsesRawModelStreamEvent(event)) {
		return null;
	}

	return event.data.event;
}

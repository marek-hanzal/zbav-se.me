import type { RunStreamEvent } from "@openai/agents";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";

interface AssistantMessageState {
	content: string;
}

function deriveAssistantMessageState(events: RunStreamEvent[]): AssistantMessageState {
	let content = "";

	for (const event of events) {
		const responseEvent = getResponseStreamEvent(event);

		if (!responseEvent) {
			continue;
		}

		if (responseEvent.type === "response.output_text.delta") {
			content += responseEvent.delta;
		} else if (responseEvent.type === "response.output_text.done") {
			content = responseEvent.text;
		}
	}

	return {
		content,
	};
}

export function selectAssistantMessageState(
	events: RunStreamEvent[] | undefined,
	itemId: string,
): AssistantMessageState {
	const mine = (events ?? []).filter((event) => {
		const responseEvent = getResponseStreamEvent(event);

		if (!responseEvent) {
			return false;
		}

		if ("item_id" in responseEvent) {
			return responseEvent.item_id === itemId;
		}

		if (
			"item" in responseEvent &&
			responseEvent.item &&
			typeof responseEvent.item === "object" &&
			"id" in responseEvent.item
		) {
			return responseEvent.item.id === itemId;
		}

		return false;
	});

	return deriveAssistantMessageState(mine);
}

import type { RunStreamEvent } from "@openai/agents";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";

interface LiveEntryBase {
	itemId: string;
}

interface LiveAssistantEntry extends LiveEntryBase {
	type: "assistant";
}

interface LiveToolCallEntry extends LiveEntryBase {
	type: "tool-call";
}

type LiveEntry = LiveAssistantEntry | LiveToolCallEntry;

export function selectLiveEntries(events: RunStreamEvent[] | undefined): LiveEntry[] {
	const seen = new Set<string>();
	const entries: LiveEntry[] = [];

	for (const event of events ?? []) {
		const responseEvent = getResponseStreamEvent(event);

		if (!responseEvent) {
			continue;
		}

		if (
			responseEvent.type !== "response.output_item.added" ||
			!responseEvent.item.id ||
			seen.has(responseEvent.item.id)
		) {
			continue;
		}

		seen.add(responseEvent.item.id);

		if (responseEvent.item.type === "function_call") {
			entries.push({
				type: "tool-call",
				itemId: responseEvent.item.id,
			});
			continue;
		}

		if (responseEvent.item.type === "message") {
			entries.push({
				type: "assistant",
				itemId: responseEvent.item.id,
			});
		}
	}

	return entries;
}

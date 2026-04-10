import type { RunStreamEvent } from "@openai/agents";
import { translator } from "@/lib/common/translator";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";

interface ErrorState {
	message: string;
}

export function selectErrorState(events: RunStreamEvent[] | undefined): ErrorState | null {
	const errorEvent = (events ?? [])
		.map(getResponseStreamEvent)
		.filter((event) => event !== null)
		.findLast((event) => event.type === "response.failed" || event.type === "error");

	if (!errorEvent) {
		return null;
	}

	if (errorEvent.type === "error") {
		return {
			message: errorEvent.message,
		};
	}

	if (errorEvent.type === "response.failed") {
		return {
			message: translator.text("Agent stream failed"),
		};
	}

	return null;
}

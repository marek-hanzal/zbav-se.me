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
		.findLast((event) => event.type === "response.failed");

	if (!errorEvent) {
		return null;
	}

	return {
		message: translator.text(errorEvent.response.error?.message ?? "Agent stream failed"),
	};
}

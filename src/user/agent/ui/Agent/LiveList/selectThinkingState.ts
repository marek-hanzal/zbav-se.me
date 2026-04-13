import type { RunStreamEvent } from "@openai/agents";
import { translator } from "@/lib/common/translator";
import { getFunctionCallResultItem } from "~/user/agent/type/getFunctionCallResultItem";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";

interface ThinkingState {
	isVisible: boolean;
	label: string | null;
}

export function selectThinkingState(events: RunStreamEvent[] | undefined): ThinkingState {
	let isVisible = false;
	let label: string | null = null;
	const pendingToolCallIds = new Set<string>();

	for (const event of events ?? []) {
		const result = getFunctionCallResultItem(event);

		if (result) {
			pendingToolCallIds.delete(result.callId);
			isVisible = pendingToolCallIds.size === 0;
			label = isVisible ? translator.text("Reasoning") : null;
			continue;
		}

		const responseEvent = getResponseStreamEvent(event);

		if (!responseEvent) {
			continue;
		}

		if (
			responseEvent.type === "response.output_text.delta" ||
			responseEvent.type === "response.output_text.done"
		) {
			isVisible = false;
			label = null;
			continue;
		}

		if (responseEvent.type === "response.reasoning_text.delta") {
			isVisible = true;
			label = translator.text("Reasoning");
			continue;
		}

		if (responseEvent.type === "response.reasoning_text.done") {
			isVisible = true;
			label = null;
			continue;
		}

		if (
			responseEvent.type === "response.output_item.added" &&
			responseEvent.item.type === "message"
		) {
			isVisible = true;
			label = translator.text("Reasoning");
			continue;
		}

		if (
			responseEvent.type === "response.output_item.added" &&
			responseEvent.item.type === "function_call"
		) {
			pendingToolCallIds.add(responseEvent.item.call_id);
			isVisible = false;
			label = null;
			continue;
		}

		if (responseEvent.type === "response.function_call_arguments.done") {
			isVisible = pendingToolCallIds.size === 0;
			label = null;
			continue;
		}

		if (responseEvent.type === "response.failed") {
			isVisible = false;
			label = null;
		}
	}

	return {
		isVisible,
		label,
	};
}

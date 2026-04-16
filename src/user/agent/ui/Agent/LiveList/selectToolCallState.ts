import type { FunctionCallResultItem, RunStreamEvent } from "@openai/agents";
import { getFunctionCallResultItem } from "~/user/agent/type/getFunctionCallResultItem";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";
import { getToolOutputText } from "~/user/agent/type/getToolOutputText";

interface ToolCallState {
	name: string;
	input: string | null;
	output: string | undefined;
	isPending: boolean;
}

export function selectToolCallState(
	events: RunStreamEvent[] | undefined,
	itemId: string,
): ToolCallState {
	const all = events ?? [];

	const created = all.find((event) => {
		const responseEvent = getResponseStreamEvent(event);

		return (
			responseEvent?.type === "response.output_item.added" &&
			responseEvent.item.type === "function_call" &&
			responseEvent.item.id === itemId
		);
	});

	const done = all.find((event) => {
		const responseEvent = getResponseStreamEvent(event);

		return (
			responseEvent?.type === "response.function_call_arguments.done" &&
			responseEvent.item_id === itemId
		);
	});

	const createdEvent = created ? getResponseStreamEvent(created) : null;
	const doneEvent = done ? getResponseStreamEvent(done) : null;

	const createdName =
		createdEvent &&
		createdEvent.type === "response.output_item.added" &&
		createdEvent.item.type === "function_call"
			? createdEvent.item.name
			: "";

	const doneArgs =
		doneEvent && doneEvent.type === "response.function_call_arguments.done"
			? doneEvent.arguments
			: null;
	const callId =
		createdEvent &&
		createdEvent.type === "response.output_item.added" &&
		createdEvent.item.type === "function_call"
			? createdEvent.item.call_id
			: null;
	const result = callId
		? all
				.map(getFunctionCallResultItem)
				.find(
					(event): event is FunctionCallResultItem =>
						event !== null && event.callId === callId,
				)
		: undefined;

	return {
		name: createdName,
		input: doneArgs,
		output: getToolOutputText(result),
		isPending: !result,
	};
}

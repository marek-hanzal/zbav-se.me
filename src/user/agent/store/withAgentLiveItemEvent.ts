import type {
	ResponseContentPartAddedEvent,
	ResponseContentPartDoneEvent,
	ResponseFunctionCallArgumentsDeltaEvent,
	ResponseFunctionCallArgumentsDoneEvent,
	ResponseFunctionToolCall,
	ResponseOutputMessage,
	ResponseOutputRefusal,
	ResponseOutputText,
	ResponseRefusalDeltaEvent,
	ResponseRefusalDoneEvent,
	ResponseTextDeltaEvent,
	ResponseTextDoneEvent,
} from "openai/resources/responses/responses";
import { match, P } from "ts-pattern";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";
import type { AgentLiveRunState } from "./AgentLiveRunState";
import type { AgentLiveSlotState } from "./AgentLiveSlotState";
import { createAgentLiveAssistantMessage } from "./createAgentLiveAssistantMessage";
import { createAgentLiveFunctionCall } from "./createAgentLiveFunctionCall";
import { withAgentLiveActivity } from "./withAgentLiveActivity";
import { withAgentLiveOutputSlot } from "./withAgentLiveOutputSlot";
import { withArrayValue } from "./withArrayValue";

type ItemEvent =
	| (ResponseContentPartAddedEvent & {
			part: ResponseOutputText | ResponseOutputRefusal;
	  })
	| (ResponseContentPartDoneEvent & {
			part: ResponseOutputText | ResponseOutputRefusal;
	  })
	| ResponseTextDeltaEvent
	| ResponseTextDoneEvent
	| ResponseRefusalDeltaEvent
	| ResponseRefusalDoneEvent
	| ResponseFunctionCallArgumentsDeltaEvent
	| ResponseFunctionCallArgumentsDoneEvent;

export namespace withAgentLiveItemEvent {
	export interface Result {
		run: AgentLiveRunState.Value;
		slotById: Record<string, AgentLiveSlotState.Value | undefined>;
	}
}

export const withAgentLiveItemEvent = ({
	run,
	slotById,
	runId,
	event,
}: {
	run: AgentLiveRunState.Value;
	slotById: Record<string, AgentLiveSlotState.Value | undefined>;
	runId: string;
	event: AgentEvent;
}): withAgentLiveItemEvent.Result => {
	const reasoningItemId = getReasoningItemId(event);

	if (reasoningItemId) {
		const nextRun = withAgentLiveActivity({
			run: {
				...run,
				activity: {
					...run.activity,
					reasoningStatusByItemId: {
						...run.activity.reasoningStatusByItemId,
						[reasoningItemId]: "in_progress",
					},
				},
			},
			slotById,
		});

		return {
			run: nextRun,
			slotById,
		};
	}

	const itemEvent = getItemEvent(event);

	if (!itemEvent) {
		return {
			run,
			slotById,
		};
	}

	const ensured = withAgentLiveOutputSlot({
		run,
		slotById,
		runId,
		outputIndex: itemEvent.output_index,
		itemId: itemEvent.item_id,
	});
	const nextItem = withNextItem({
		item: ensured.slot.item,
		itemId: itemEvent.item_id,
		event: itemEvent,
	});
	const nextSlot = {
		...ensured.slot,
		itemId: itemEvent.item_id,
		item: nextItem,
	};
	const nextSlotById = {
		...ensured.slotById,
		[ensured.slotId]: nextSlot,
	};
	const nextRun = withAgentLiveActivity({
		run: ensured.run,
		slotById: nextSlotById,
	});

	return {
		run: nextRun,
		slotById: nextSlotById,
	};
};

const getReasoningItemId = (event: AgentEvent): string | undefined => {
	return match(event)
		.with(
			{
				type: "response.reasoning_summary_part.added",
				item_id: P.string,
			},
			(event) => event.item_id,
		)
		.with(
			{
				type: "response.reasoning_summary_part.done",
				item_id: P.string,
			},
			(event) => event.item_id,
		)
		.with(
			{
				type: "response.reasoning_summary_text.delta",
				item_id: P.string,
			},
			(event) => event.item_id,
		)
		.with(
			{
				type: "response.reasoning_summary_text.done",
				item_id: P.string,
			},
			(event) => event.item_id,
		)
		.with(
			{
				type: "response.reasoning_text.delta",
				item_id: P.string,
			},
			(event) => event.item_id,
		)
		.with(
			{
				type: "response.reasoning_text.done",
				item_id: P.string,
			},
			(event) => event.item_id,
		)
		.with(
			{
				type: "response.content_part.added",
				item_id: P.string,
				part: {
					type: "reasoning_text",
				},
			},
			(event) => event.item_id,
		)
		.with(
			{
				type: "response.content_part.done",
				item_id: P.string,
				part: {
					type: "reasoning_text",
				},
			},
			(event) => event.item_id,
		)
		.otherwise(() => undefined);
};

const getItemEvent = (event: AgentEvent): ItemEvent | undefined => {
	return match(event)
		.with(
			{
				type: "response.content_part.added",
				part: {
					type: P.union("output_text", "refusal"),
				},
			},
			(event) => event as ItemEvent,
		)
		.with(
			{
				type: "response.content_part.done",
				part: {
					type: P.union("output_text", "refusal"),
				},
			},
			(event) => event as ItemEvent,
		)
		.with(
			{
				type: "response.output_text.delta",
			},
			(event) => event,
		)
		.with(
			{
				type: "response.output_text.done",
			},
			(event) => event,
		)
		.with(
			{
				type: "response.refusal.delta",
			},
			(event) => event,
		)
		.with(
			{
				type: "response.refusal.done",
			},
			(event) => event,
		)
		.with(
			{
				type: "response.function_call_arguments.delta",
			},
			(event) => event,
		)
		.with(
			{
				type: "response.function_call_arguments.done",
			},
			(event) => event,
		)
		.otherwise(() => undefined);
};

const withNextItem = ({
	item,
	itemId,
	event,
}: {
	item: AgentLiveSlotState.Value["item"];
	itemId: string;
	event: ItemEvent;
}) => {
	return match(event)
		.with(
			{
				type: "response.content_part.added",
			},
			(event) => {
				return withMessagePart({
					item,
					itemId,
					contentIndex: event.content_index,
					part: event.part,
				});
			},
		)
		.with(
			{
				type: "response.content_part.done",
			},
			(event) => {
				return withMessagePart({
					item,
					itemId,
					contentIndex: event.content_index,
					part: event.part,
				});
			},
		)
		.with(
			{
				type: "response.output_text.delta",
			},
			(event) => {
				const message = asAssistantMessage({
					item,
					itemId,
				});

				return {
					...message,
					content: withArrayValue({
						source: message.content,
						index: event.content_index,
						valueFx(current) {
							const text = current?.type === "output_text" ? current.text : "";
							const annotations =
								current?.type === "output_text" ? current.annotations : [];

							return {
								type: "output_text",
								text: `${text}${event.delta}`,
								annotations,
							} satisfies ResponseOutputText;
						},
					}),
				};
			},
		)
		.with(
			{
				type: "response.output_text.done",
			},
			(event) => {
				const message = asAssistantMessage({
					item,
					itemId,
				});

				return {
					...message,
					content: withArrayValue({
						source: message.content,
						index: event.content_index,
						valueFx(current) {
							return {
								type: "output_text",
								text: event.text,
								annotations:
									current?.type === "output_text" ? current.annotations : [],
							} satisfies ResponseOutputText;
						},
					}),
				};
			},
		)
		.with(
			{
				type: "response.refusal.delta",
			},
			(event) => {
				const message = asAssistantMessage({
					item,
					itemId,
				});

				return {
					...message,
					content: withArrayValue({
						source: message.content,
						index: event.content_index,
						valueFx(current) {
							const refusal = current?.type === "refusal" ? current.refusal : "";

							return {
								type: "refusal",
								refusal: `${refusal}${event.delta}`,
							} satisfies ResponseOutputRefusal;
						},
					}),
				};
			},
		)
		.with(
			{
				type: "response.refusal.done",
			},
			(event) => {
				const message = asAssistantMessage({
					item,
					itemId,
				});

				return {
					...message,
					content: withArrayValue({
						source: message.content,
						index: event.content_index,
						valueFx() {
							return {
								type: "refusal",
								refusal: event.refusal,
							} satisfies ResponseOutputRefusal;
						},
					}),
				};
			},
		)
		.with(
			{
				type: "response.function_call_arguments.delta",
			},
			(event) => {
				const call = asFunctionCall({
					item,
					itemId,
				});

				return {
					...call,
					arguments: `${call.arguments}${event.delta}`,
				};
			},
		)
		.with(
			{
				type: "response.function_call_arguments.done",
			},
			(event) => {
				const call = asFunctionCall({
					item,
					itemId,
				});

				return {
					...call,
					name: event.name,
					arguments: event.arguments,
				};
			},
		)
		.exhaustive();
};

const withMessagePart = ({
	item,
	itemId,
	contentIndex,
	part,
}: {
	item: AgentLiveSlotState.Value["item"];
	itemId: string;
	contentIndex: number;
	part: ResponseOutputText | ResponseOutputRefusal;
}): ResponseOutputMessage => {
	const message = asAssistantMessage({
		item,
		itemId,
	});

	return {
		...message,
		content: withArrayValue({
			source: message.content,
			index: contentIndex,
			valueFx() {
				return part;
			},
		}),
	};
};

const asAssistantMessage = ({
	item,
	itemId,
}: {
	item: AgentLiveSlotState.Value["item"];
	itemId: string;
}): ResponseOutputMessage => {
	if (item?.type === "message" && item.role === "assistant") {
		return item;
	}

	return createAgentLiveAssistantMessage({
		itemId,
	});
};

const asFunctionCall = ({
	item,
	itemId,
}: {
	item: AgentLiveSlotState.Value["item"];
	itemId: string;
}): ResponseFunctionToolCall => {
	if (item?.type === "function_call") {
		return item;
	}

	return createAgentLiveFunctionCall({
		itemId,
	});
};

import type {
	ResponseContentPartAddedEvent,
	ResponseContentPartDoneEvent,
	ResponseFunctionCallArgumentsDeltaEvent,
	ResponseFunctionCallArgumentsDoneEvent,
	ResponseFunctionToolCall,
	ResponseOutputItem,
	ResponseOutputMessage,
	ResponseOutputRefusal,
	ResponseOutputText,
	ResponseReasoningItem,
	ResponseRefusalDeltaEvent,
	ResponseRefusalDoneEvent,
	ResponseTextDeltaEvent,
	ResponseTextDoneEvent,
} from "openai/resources/responses/responses";
import { match } from "ts-pattern";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";

export namespace agentLiveStreamState {
	export type RunStatus = "streaming" | "completed" | "cancelled" | "failed" | "incomplete";

	export type NoticeKind = Exclude<RunStatus, "streaming" | "completed">;

	export interface RunState {
		runId: string;
		userText: string;
		itemIds: string[];
		itemIdsByOutputIndex: Record<string, string>;
		status: RunStatus;
		responseId?: string;
		notice?: NoticeKind;
	}

	export type ItemState = ResponseOutputItem;

	export interface EnsureRunItemResult {
		nextRun: RunState;
		previousItemId?: string;
	}
}

export const createRun = ({
	runId,
	userText,
}: {
	runId: string;
	userText: string;
}): agentLiveStreamState.RunState => {
	return {
		runId,
		userText,
		itemIds: [],
		itemIdsByOutputIndex: {},
		status: "streaming",
	};
};

export const getFallbackItemId = ({
	runId,
	outputIndex,
}: {
	runId: string;
	outputIndex: number;
}): string => {
	return `${runId}-output-${outputIndex}`;
};

export const withResponseId = ({
	run,
	responseId,
}: {
	run: agentLiveStreamState.RunState;
	responseId: string;
}): agentLiveStreamState.RunState => {
	return {
		...run,
		responseId,
	};
};

export const ensureRunItem = ({
	run,
	outputIndex,
	itemId,
}: {
	run: agentLiveStreamState.RunState;
	outputIndex: number;
	itemId: string;
}): agentLiveStreamState.EnsureRunItemResult => {
	const key = String(outputIndex);
	const currentItemId = run.itemIdsByOutputIndex[key];

	if (currentItemId === itemId) {
		return {
			nextRun: run,
		};
	}

	if (currentItemId) {
		const nextItemIdsByOutputIndex = {
			...run.itemIdsByOutputIndex,
			[key]: itemId,
		};

		return {
			nextRun: {
				...run,
				itemIds: getOrderedItemIds(nextItemIdsByOutputIndex),
				itemIdsByOutputIndex: nextItemIdsByOutputIndex,
				status: "streaming",
				notice: undefined,
			},
			previousItemId: currentItemId,
		};
	}

	const nextItemIdsByOutputIndex = {
		...run.itemIdsByOutputIndex,
		[key]: itemId,
	};

	return {
		nextRun: {
			...run,
			itemIds: getOrderedItemIds(nextItemIdsByOutputIndex),
			itemIdsByOutputIndex: nextItemIdsByOutputIndex,
			status: "streaming",
			notice: undefined,
		},
	};
};

export const withTerminalStatus = ({
	run,
	status,
}: {
	run: agentLiveStreamState.RunState;
	status: agentLiveStreamState.RunStatus;
}): agentLiveStreamState.RunState => {
	return {
		...run,
		status,
		notice: getNoticeKind(status),
	};
};

export const applyEventToItem = ({
	item,
	event,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	event: AgentEvent;
}): agentLiveStreamState.ItemState | undefined => {
	return match(event)
		.with(
			{
				type: "response.content_part.added",
			},
			(event) => {
				return applyContentPartEvent({
					item,
					event,
				});
			},
		)
		.with(
			{
				type: "response.content_part.done",
			},
			(event) => {
				return applyContentPartEvent({
					item,
					event,
				});
			},
		)
		.with(
			{
				type: "response.output_text.delta",
			},
			(event) => {
				return applyTextDelta({
					item,
					event,
				});
			},
		)
		.with(
			{
				type: "response.output_text.done",
			},
			(event) => {
				return applyTextDone({
					item,
					event,
				});
			},
		)
		.with(
			{
				type: "response.refusal.delta",
			},
			(event) => {
				return applyRefusalDelta({
					item,
					event,
				});
			},
		)
		.with(
			{
				type: "response.refusal.done",
			},
			(event) => {
				return applyRefusalDone({
					item,
					event,
				});
			},
		)
		.with(
			{
				type: "response.reasoning_summary_part.added",
			},
			(event) => {
				return applyReasoningSummary({
					item,
					itemId: event.item_id,
					index: event.summary_index,
					text: event.part.text,
				});
			},
		)
		.with(
			{
				type: "response.reasoning_summary_part.done",
			},
			(event) => {
				return applyReasoningSummary({
					item,
					itemId: event.item_id,
					index: event.summary_index,
					text: event.part.text,
				});
			},
		)
		.with(
			{
				type: "response.reasoning_summary_text.delta",
			},
			(event) => {
				return applyReasoningSummary({
					item,
					itemId: event.item_id,
					index: event.summary_index,
					text: event.delta,
					append: true,
				});
			},
		)
		.with(
			{
				type: "response.reasoning_summary_text.done",
			},
			(event) => {
				return applyReasoningSummary({
					item,
					itemId: event.item_id,
					index: event.summary_index,
					text: event.text,
				});
			},
		)
		.with(
			{
				type: "response.reasoning_text.delta",
			},
			(event) => {
				return applyReasoningContent({
					item,
					itemId: event.item_id,
					index: event.content_index,
					text: event.delta,
					append: true,
				});
			},
		)
		.with(
			{
				type: "response.reasoning_text.done",
			},
			(event) => {
				return applyReasoningContent({
					item,
					itemId: event.item_id,
					index: event.content_index,
					text: event.text,
				});
			},
		)
		.with(
			{
				type: "response.function_call_arguments.delta",
			},
			(event) => {
				return applyFunctionArgumentsDelta({
					item,
					event,
				});
			},
		)
		.with(
			{
				type: "response.function_call_arguments.done",
			},
			(event) => {
				return applyFunctionArgumentsDone({
					item,
					event,
				});
			},
		)
		.otherwise(() => item);
};

const getNoticeKind = (
	status: agentLiveStreamState.RunStatus,
): agentLiveStreamState.NoticeKind | undefined => {
	return match(status)
		.with("cancelled", "failed", "incomplete", (status) => status)
		.otherwise(() => undefined);
};

const applyContentPartEvent = ({
	item,
	event,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	event: ResponseContentPartAddedEvent | ResponseContentPartDoneEvent;
}): agentLiveStreamState.ItemState => {
	return match(event.part)
		.with(
			{
				type: "reasoning_text",
			},
			(part) => {
				return applyReasoningContent({
					item,
					itemId: event.item_id,
					index: event.content_index,
					text: part.text,
				});
			},
		)
		.otherwise((part) => {
			return upsertMessagePart({
				item,
				itemId: event.item_id,
				contentIndex: event.content_index,
				part,
			});
		});
};

const applyTextDelta = ({
	item,
	event,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	event: ResponseTextDeltaEvent;
}): agentLiveStreamState.ItemState => {
	const message = ensureAssistantMessage({
		item,
		itemId: event.item_id,
	});

	return {
		...message,
		content: setArrayValue({
			source: message.content,
			index: event.content_index,
			valueFx(current) {
				const text = current?.type === "output_text" ? current.text : "";
				const annotations = current?.type === "output_text" ? current.annotations : [];

				return {
					type: "output_text",
					text: `${text}${event.delta}`,
					annotations,
				};
			},
		}),
	};
};

const applyTextDone = ({
	item,
	event,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	event: ResponseTextDoneEvent;
}): agentLiveStreamState.ItemState => {
	const message = ensureAssistantMessage({
		item,
		itemId: event.item_id,
	});

	return {
		...message,
		content: setArrayValue({
			source: message.content,
			index: event.content_index,
			valueFx(current) {
				const annotations = current?.type === "output_text" ? current.annotations : [];

				return {
					type: "output_text",
					text: event.text,
					annotations,
				};
			},
		}),
	};
};

const applyRefusalDelta = ({
	item,
	event,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	event: ResponseRefusalDeltaEvent;
}): agentLiveStreamState.ItemState => {
	const message = ensureAssistantMessage({
		item,
		itemId: event.item_id,
	});

	return {
		...message,
		content: setArrayValue({
			source: message.content,
			index: event.content_index,
			valueFx(current) {
				const refusal = current?.type === "refusal" ? current.refusal : "";

				return {
					type: "refusal",
					refusal: `${refusal}${event.delta}`,
				};
			},
		}),
	};
};

const applyRefusalDone = ({
	item,
	event,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	event: ResponseRefusalDoneEvent;
}): agentLiveStreamState.ItemState => {
	const message = ensureAssistantMessage({
		item,
		itemId: event.item_id,
	});

	return {
		...message,
		content: setArrayValue({
			source: message.content,
			index: event.content_index,
			valueFx() {
				return {
					type: "refusal",
					refusal: event.refusal,
				};
			},
		}),
	};
};

const applyReasoningSummary = ({
	item,
	itemId,
	index,
	text,
	append = false,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	itemId: string;
	index: number;
	text: string;
	append?: boolean;
}): agentLiveStreamState.ItemState => {
	const reasoning = ensureReasoningItem({
		item,
		itemId,
	});

	return {
		...reasoning,
		summary: setArrayValue({
			source: reasoning.summary,
			index,
			valueFx(current) {
				return {
					type: "summary_text",
					text: append ? `${current?.text ?? ""}${text}` : text,
				};
			},
		}),
	};
};

const applyReasoningContent = ({
	item,
	itemId,
	index,
	text,
	append = false,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	itemId: string;
	index: number;
	text: string;
	append?: boolean;
}): agentLiveStreamState.ItemState => {
	const reasoning = ensureReasoningItem({
		item,
		itemId,
	});
	const content = reasoning.content ?? [];

	return {
		...reasoning,
		content: setArrayValue({
			source: content,
			index,
			valueFx(current) {
				return {
					type: "reasoning_text",
					text: append ? `${current?.text ?? ""}${text}` : text,
				};
			},
		}),
	};
};

const applyFunctionArgumentsDelta = ({
	item,
	event,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	event: ResponseFunctionCallArgumentsDeltaEvent;
}): agentLiveStreamState.ItemState => {
	const call = ensureFunctionCall({
		item,
		itemId: event.item_id,
	});

	return {
		...call,
		arguments: `${call.arguments}${event.delta}`,
	};
};

const applyFunctionArgumentsDone = ({
	item,
	event,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	event: ResponseFunctionCallArgumentsDoneEvent;
}): agentLiveStreamState.ItemState => {
	const call = ensureFunctionCall({
		item,
		itemId: event.item_id,
	});

	return {
		...call,
		name: event.name,
		arguments: event.arguments,
	};
};

const ensureAssistantMessage = ({
	item,
	itemId,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	itemId: string;
}): ResponseOutputMessage => {
	if (item?.type === "message" && item.role === "assistant") {
		return item;
	}

	return {
		id: itemId,
		type: "message",
		role: "assistant",
		status: "in_progress",
		content: [],
	};
};

const ensureReasoningItem = ({
	item,
	itemId,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	itemId: string;
}): ResponseReasoningItem => {
	if (item?.type === "reasoning") {
		return item;
	}

	return {
		id: itemId,
		type: "reasoning",
		summary: [],
		content: [],
		status: "in_progress",
	};
};

const ensureFunctionCall = ({
	item,
	itemId,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	itemId: string;
}): ResponseFunctionToolCall => {
	if (item?.type === "function_call") {
		return item;
	}

	return {
		id: itemId,
		type: "function_call",
		call_id: itemId,
		name: "function",
		arguments: "",
		status: "in_progress",
	};
};

const upsertMessagePart = ({
	item,
	itemId,
	contentIndex,
	part,
}: {
	item: agentLiveStreamState.ItemState | undefined;
	itemId: string;
	contentIndex: number;
	part: ResponseOutputText | ResponseOutputRefusal;
}): ResponseOutputMessage => {
	const message = ensureAssistantMessage({
		item,
		itemId,
	});

	return {
		...message,
		content: setArrayValue({
			source: message.content,
			index: contentIndex,
			valueFx() {
				return part;
			},
		}),
	};
};

const setArrayValue = <T>({
	source,
	index,
	valueFx,
}: {
	source: T[];
	index: number;
	valueFx(value: T | undefined): T;
}): T[] => {
	const next = [
		...source,
	];

	next[index] = valueFx(source[index]);

	return next;
};

const getOrderedItemIds = (itemIdsByOutputIndex: Record<string, string>): string[] => {
	return Object.entries(itemIdsByOutputIndex)
		.sort(([left], [right]) => Number(left) - Number(right))
		.map(([, itemId]) => itemId);
};

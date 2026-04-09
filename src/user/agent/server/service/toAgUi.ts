import { type AGUIEvent, EventSchemas, EventType } from "@ag-ui/core";
import type { RunStreamEvent } from "@openai/agents-core";
import { resolveToolSearchCallId } from "@openai/agents-core/utils";
import { match, P } from "ts-pattern";
import { getAssistantChatToolOutputText } from "~/user/assistant/service/getAssistantChatToolOutputText";
import { toAssistantChatDisplayText } from "~/user/assistant/service/toAssistantChatDisplayText";

export namespace toAgUi {
	export interface Props {
		runId: string;
		threadId: string;
	}

	export interface Result {
		fail(error: unknown): AGUIEvent[];
		finish(): AGUIEvent[];
		map(event: RunStreamEvent): AGUIEvent[];
		start(): AGUIEvent[];
	}
}

export const toAgUi = ({ runId, threadId }: toAgUi.Props) => {
	const openReasoningMessageIds = new Set<string>();
	const openTextMessageIds = new Set<string>();
	const openToolCallIds = new Set<string>();
	const toolCallNames = new Map<string, string>();

	const toEvent = (event: AGUIEvent): AGUIEvent => {
		return EventSchemas.parse({
			timestamp: Date.now(),
			...event,
		});
	};

	const closeOpenEvents = (): AGUIEvent[] => {
		const events: AGUIEvent[] = [];

		for (const messageId of openTextMessageIds) {
			events.push(
				toEvent({
					type: EventType.TEXT_MESSAGE_END,
					messageId,
				}),
			);
		}

		for (const messageId of openReasoningMessageIds) {
			events.push(
				toEvent({
					type: EventType.REASONING_MESSAGE_END,
					messageId,
				}),
			);
			events.push(
				toEvent({
					type: EventType.REASONING_END,
					messageId,
				}),
			);
		}

		for (const toolCallId of openToolCallIds) {
			events.push(
				toEvent({
					type: EventType.TOOL_CALL_END,
					toolCallId,
				}),
			);
		}

		openTextMessageIds.clear();
		openReasoningMessageIds.clear();
		openToolCallIds.clear();

		return events;
	};

	const ensureTextMessage = ({
		messageId,
		rawEvent,
	}: {
		messageId: string;
		rawEvent?: unknown;
	}): AGUIEvent[] => {
		if (openTextMessageIds.has(messageId)) {
			return [];
		}

		openTextMessageIds.add(messageId);

		return [
			toEvent({
				type: EventType.TEXT_MESSAGE_START,
				messageId,
				role: "assistant",
				rawEvent,
			}),
		];
	};

	const ensureReasoningMessage = ({
		messageId,
		rawEvent,
	}: {
		messageId: string;
		rawEvent?: unknown;
	}): AGUIEvent[] => {
		if (openReasoningMessageIds.has(messageId)) {
			return [];
		}

		openReasoningMessageIds.add(messageId);

		return [
			toEvent({
				type: EventType.REASONING_START,
				messageId,
				rawEvent,
			}),
			toEvent({
				type: EventType.REASONING_MESSAGE_START,
				messageId,
				role: "reasoning",
				rawEvent,
			}),
		];
	};

	const ensureToolCall = ({
		rawEvent,
		toolCallId,
		toolCallName,
	}: {
		rawEvent?: unknown;
		toolCallId: string;
		toolCallName?: string;
	}): AGUIEvent[] => {
		if (toolCallName) {
			toolCallNames.set(toolCallId, toolCallName);
		}

		if (openToolCallIds.has(toolCallId)) {
			return [];
		}

		openToolCallIds.add(toolCallId);

		return [
			toEvent({
				type: EventType.TOOL_CALL_START,
				toolCallId,
				toolCallName: toolCallNames.get(toolCallId) ?? toolCallName ?? "tool",
				rawEvent,
			}),
		];
	};

	return {
		start() {
			return [
				toEvent({
					type: EventType.RUN_STARTED,
					threadId,
					runId,
				}),
			];
		},
		map(event) {
			return match(event)
				.returnType<AGUIEvent[]>()
				.with(
					{
						type: "raw_model_stream_event",
						source: "openai-responses",
						data: {
							type: "model",
							event: {
								type: "response.output_text.delta",
								item_id: P.string,
								delta: P.string,
							},
						},
					},
					(event) => {
						return [
							...ensureTextMessage({
								messageId: event.data.event.item_id,
								rawEvent: event,
							}),
							toEvent({
								type: EventType.TEXT_MESSAGE_CONTENT,
								messageId: event.data.event.item_id,
								delta: event.data.event.delta,
								rawEvent: event,
							}),
						];
					},
				)
				.with(
					{
						type: "raw_model_stream_event",
						source: "openai-responses",
						data: {
							type: "model",
							event: {
								type: P.union(
									"response.reasoning_text.delta",
									"response.reasoning_summary_text.delta",
								),
								item_id: P.string,
								delta: P.string,
							},
						},
					},
					(event) => {
						return [
							...ensureReasoningMessage({
								messageId: event.data.event.item_id,
								rawEvent: event,
							}),
							toEvent({
								type: EventType.REASONING_MESSAGE_CONTENT,
								messageId: event.data.event.item_id,
								delta: event.data.event.delta,
								rawEvent: event,
							}),
						];
					},
				)
				.with(
					{
						type: "raw_model_stream_event",
						source: "openai-responses",
						data: {
							type: "model",
							event: {
								type: "response.function_call_arguments.delta",
								item_id: P.string,
								delta: P.string,
							},
						},
					},
					(event) => {
						return [
							...ensureToolCall({
								toolCallId: event.data.event.item_id,
								rawEvent: event,
							}),
							toEvent({
								type: EventType.TOOL_CALL_ARGS,
								toolCallId: event.data.event.item_id,
								delta: event.data.event.delta,
								rawEvent: event,
							}),
						];
					},
				)
				.with(
					{
						type: "run_item_stream_event",
						name: P.union("tool_called", "tool_search_called"),
						item: {
							rawItem: P.any,
						},
					},
					(event) => {
						const rawItem = event.item.rawItem;

						return match(rawItem)
							.returnType<AGUIEvent[]>()
							.with(
								{
									type: "function_call",
									callId: P.string,
									name: P.string,
								},
								(rawItem) => {
									return ensureToolCall({
										toolCallId: rawItem.callId,
										toolCallName: rawItem.name,
										rawEvent: event,
									});
								},
							)
							.with(
								{
									type: "tool_search_call",
									arguments: P.any,
								},
								(rawItem) => {
									const toolCallId = resolveToolSearchCallId(rawItem);

									return [
										...ensureToolCall({
											toolCallId,
											toolCallName: "tool_search",
											rawEvent: event,
										}),
										toEvent({
											type: EventType.TOOL_CALL_ARGS,
											toolCallId,
											delta: toAssistantChatDisplayText({
												value: rawItem.arguments,
											}),
											rawEvent: event,
										}),
									];
								},
							)
							.otherwise(() => []);
					},
				)
				.with(
					{
						type: "run_item_stream_event",
						name: P.union("tool_output", "tool_search_output_created"),
						item: {
							rawItem: P.any,
						},
					},
					(event) => {
						const rawItem = event.item.rawItem;

						return match(rawItem)
							.returnType<AGUIEvent[]>()
							.with(
								{
									type: "function_call_result",
									callId: P.string,
									name: P.string,
								},
								(rawItem) => {
									return [
										...ensureToolCall({
											toolCallId: rawItem.callId,
											toolCallName: rawItem.name,
											rawEvent: event,
										}),
										toEvent({
											type: EventType.TOOL_CALL_RESULT,
											messageId: `tool-result-${rawItem.callId}`,
											toolCallId: rawItem.callId,
											content: getAssistantChatToolOutputText({
												value: rawItem,
											}),
											role: "tool",
											rawEvent: event,
										}),
										toEvent({
											type: EventType.TOOL_CALL_END,
											toolCallId: rawItem.callId,
											rawEvent: event,
										}),
									];
								},
							)
							.with(
								{
									type: "tool_search_output",
									tools: P.any,
								},
								(rawItem) => {
									const toolCallId = resolveToolSearchCallId(rawItem);

									return [
										...ensureToolCall({
											toolCallId,
											toolCallName: "tool_search",
											rawEvent: event,
										}),
										toEvent({
											type: EventType.TOOL_CALL_RESULT,
											messageId: `tool-result-${toolCallId}`,
											toolCallId,
											content: toAssistantChatDisplayText({
												value: rawItem.tools,
											}),
											role: "tool",
											rawEvent: event,
										}),
										toEvent({
											type: EventType.TOOL_CALL_END,
											toolCallId,
											rawEvent: event,
										}),
									];
								},
							)
							.otherwise(() => []);
					},
				)
				.otherwise(() => []);
		},
		finish() {
			return [
				...closeOpenEvents(),
				toEvent({
					type: EventType.RUN_FINISHED,
					threadId,
					runId,
				}),
			];
		},
		fail(error) {
			return [
				...closeOpenEvents(),
				toEvent({
					type: EventType.RUN_ERROR,
					message: error instanceof Error ? error.message : "Assistant stream failed",
				}),
			];
		},
	} as const satisfies toAgUi.Result;
};

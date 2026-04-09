import { resolveToolSearchCallId } from "@openai/agents-core/utils";
import { match, P } from "ts-pattern";
import { genId } from "@/lib/common/gen-id";
import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import { appendAssistantChatReasoningDelta } from "./appendAssistantChatReasoningDelta";
import { appendAssistantChatTextDelta } from "./appendAssistantChatTextDelta";
import { createAssistantChatMessage } from "./createAssistantChatMessage";
import { getAssistantChatToolCallStatus } from "./getAssistantChatToolCallStatus";
import { getAssistantChatToolOutputText } from "./getAssistantChatToolOutputText";
import { getRunItemRawItem } from "./getRunItemRawItem";
import { toAssistantChatDisplayText } from "./toAssistantChatDisplayText";
import { upsertAssistantChatMessage } from "./upsertAssistantChatMessage";
import { upsertAssistantChatToolCall } from "./upsertAssistantChatToolCall";

export namespace reduceAssistantChatStreamEvent {
	export type Status = "idle" | "submitted" | "streaming" | "error";

	export interface Props {
		event: unknown;
		messages: AssistantChatMessageSchema.Type[];
		status: Status;
	}

	export interface Result {
		messages: AssistantChatMessageSchema.Type[];
		status: Status;
	}
}

export const reduceAssistantChatStreamEvent = ({
	event,
	messages,
	status,
}: reduceAssistantChatStreamEvent.Props): reduceAssistantChatStreamEvent.Result => {
	return match(event)
		.returnType<reduceAssistantChatStreamEvent.Result>()
		.with(
			{
				type: "raw_model_stream_event",
				source: "openai-responses",
				data: {
					type: "model",
					event: {
						type: "response.output_text.delta",
						item_id: P.string,
						content_index: P.number,
						delta: P.string,
					},
				},
			},
			(event) => {
				const assistantMessage =
					messages.findLast((message) => message.role === "assistant") ??
					createAssistantChatMessage({
						id: event.data.event.item_id,
						role: "assistant",
					});

				return {
					status: "streaming",
					messages: upsertAssistantChatMessage({
						messages,
						message: appendAssistantChatTextDelta({
							message: assistantMessage,
							delta: {
								partId: `${event.data.event.item_id}-text-${event.data.event.content_index}`,
								text: event.data.event.delta,
							},
						}),
					}),
				};
			},
		)
		.with(
			{
				type: "raw_model_stream_event",
				source: "openai-responses",
				data: {
					type: "model",
					event: {
						type: "response.reasoning_text.delta",
						item_id: P.string,
						content_index: P.number,
						delta: P.string,
					},
				},
			},
			(event) => {
				const assistantMessage =
					messages.findLast((message) => message.role === "assistant") ??
					createAssistantChatMessage({
						id: event.data.event.item_id,
						role: "assistant",
					});

				return {
					status: "streaming",
					messages: upsertAssistantChatMessage({
						messages,
						message: appendAssistantChatReasoningDelta({
							message: assistantMessage,
							delta: {
								partId: `${event.data.event.item_id}-reasoning-${event.data.event.content_index}`,
								text: event.data.event.delta,
							},
						}),
					}),
				};
			},
		)
		.with(
			{
				type: "raw_model_stream_event",
				source: "openai-responses",
				data: {
					type: "model",
					event: {
						type: "response.reasoning_summary_text.delta",
						item_id: P.string,
						summary_index: P.number,
						delta: P.string,
					},
				},
			},
			(event) => {
				const assistantMessage =
					messages.findLast((message) => message.role === "assistant") ??
					createAssistantChatMessage({
						id: event.data.event.item_id,
						role: "assistant",
					});

				return {
					status: "streaming",
					messages: upsertAssistantChatMessage({
						messages,
						message: appendAssistantChatReasoningDelta({
							message: assistantMessage,
							delta: {
								partId: `${event.data.event.item_id}-summary-${event.data.event.summary_index}`,
								text: event.data.event.delta,
							},
						}),
					}),
				};
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
				const assistantMessage =
					messages.findLast((message) => message.role === "assistant") ??
					createAssistantChatMessage({
						id: genId(),
						role: "assistant",
					});
				const currentPart = assistantMessage.parts.find((part) => {
					return part.id === event.data.event.item_id && part.type === "tool_call";
				});

				return {
					status: "streaming",
					messages: upsertAssistantChatMessage({
						messages,
						message: upsertAssistantChatToolCall({
							message: assistantMessage,
							patch: {
								id: event.data.event.item_id,
								input: `${currentPart?.type === "tool_call" ? currentPart.input : ""}${event.data.event.delta}`,
							},
						}),
					}),
				};
			},
		)
		.with(
			{
				type: "run_item_stream_event",
				name: P.union("tool_called", "tool_search_called"),
				item: P.any,
			},
			(event) => {
				const rawItem = getRunItemRawItem({
					item: event.item,
				});
				const assistantMessage =
					messages.findLast((message) => message.role === "assistant") ??
					createAssistantChatMessage({
						id: genId(),
						role: "assistant",
					});

				return match(rawItem)
					.returnType<reduceAssistantChatStreamEvent.Result>()
					.with(
						{
							type: "function_call",
							callId: P.string,
							name: P.string,
							arguments: P.string,
						},
						(rawItem) => {
							return {
								status: "streaming" satisfies reduceAssistantChatStreamEvent.Status,
								messages: upsertAssistantChatMessage({
									messages,
									message: upsertAssistantChatToolCall({
										message: assistantMessage,
										patch: {
											id: rawItem.callId,
											toolName: rawItem.name,
											status: getAssistantChatToolCallStatus({
												value: rawItem,
												fallback: "in_progress",
											}),
											input: rawItem.arguments,
										},
									}),
								}),
							};
						},
					)
					.with(
						{
							type: "tool_search_call",
							arguments: P.any,
						},
						(rawItem) => {
							return {
								status: "streaming" satisfies reduceAssistantChatStreamEvent.Status,
								messages: upsertAssistantChatMessage({
									messages,
									message: upsertAssistantChatToolCall({
										message: assistantMessage,
										patch: {
											id: resolveToolSearchCallId(
												rawItem as Parameters<
													typeof resolveToolSearchCallId
												>[0],
												() => {
													return "tool-search-0";
												},
											),
											toolName: "tool_search",
											status: "in_progress",
											input: toAssistantChatDisplayText({
												value: rawItem.arguments,
											}),
										},
									}),
								}),
							};
						},
					)
					.otherwise(() => ({
						messages,
						status,
					}));
			},
		)
		.with(
			{
				type: "run_item_stream_event",
				name: P.union("tool_output", "tool_search_output_created"),
				item: P.any,
			},
			(event) => {
				const rawItem = getRunItemRawItem({
					item: event.item,
				});
				const assistantMessage =
					messages.findLast((message) => message.role === "assistant") ??
					createAssistantChatMessage({
						id: genId(),
						role: "assistant",
					});

				return match(rawItem)
					.returnType<reduceAssistantChatStreamEvent.Result>()
					.with(
						{
							type: "function_call_result",
							callId: P.string,
							name: P.string,
						},
						(rawItem) => {
							return {
								status: "streaming" satisfies reduceAssistantChatStreamEvent.Status,
								messages: upsertAssistantChatMessage({
									messages,
									message: upsertAssistantChatToolCall({
										message: assistantMessage,
										patch: {
											id: rawItem.callId,
											toolName: rawItem.name,
											status: getAssistantChatToolCallStatus({
												value: rawItem,
												fallback: "completed",
											}),
											output: getAssistantChatToolOutputText({
												value: rawItem,
											}),
										},
									}),
								}),
							};
						},
					)
					.with(
						{
							type: "tool_search_output",
							tools: P.any,
						},
						(rawItem) => {
							return {
								status: "streaming" satisfies reduceAssistantChatStreamEvent.Status,
								messages: upsertAssistantChatMessage({
									messages,
									message: upsertAssistantChatToolCall({
										message: assistantMessage,
										patch: {
											id: resolveToolSearchCallId(
												rawItem as Parameters<
													typeof resolveToolSearchCallId
												>[0],
												() => {
													return "tool-search-0";
												},
											),
											toolName: "tool_search",
											status: "completed",
											output: toAssistantChatDisplayText({
												value: rawItem.tools,
											}),
										},
									}),
								}),
							};
						},
					)
					.otherwise(() => ({
						messages,
						status,
					}));
			},
		)
		.otherwise(() => ({
			messages,
			status,
		}));
};

import type { AgentInputItem } from "@openai/agents-core";
import { resolveToolSearchCallId } from "@openai/agents-core/utils";
import { match } from "ts-pattern";
import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import type { AssistantChatPartTypeEnumSchema } from "~/user/assistant/schema/part/AssistantChatPartTypeEnumSchema";
import { ensureAssistantMessage } from "./ensureAssistantMessage";
import { getAssistantTextParts } from "./getAssistantTextParts";
import { getReasoningText } from "./getReasoningText";
import { getSystemMessageText } from "./getSystemMessageText";
import { getUserMessageText } from "./getUserMessageText";
import type { MutableAssistantMessage } from "./MutableAssistantMessage";
import { normalizeAssistantChatStatus } from "./normalizeAssistantChatStatus";
import { replaceAssistantChatReasoning } from "./replaceAssistantChatReasoning";
import { toAssistantChatDisplayText } from "./toAssistantChatDisplayText";
import { upsertAssistantChatPart } from "./upsertAssistantChatPart";
import { upsertAssistantChatToolCall } from "./upsertAssistantChatToolCall";

export namespace fromAgentInputItems {
	export interface Props {
		items: AgentInputItem[];
	}
}

export const fromAgentInputItems = ({
	items,
}: fromAgentInputItems.Props): AssistantChatMessageSchema.Type[] => {
	const messages: MutableAssistantMessage[] = [];

	for (const [index, item] of items.entries()) {
		match(item)
			.with(
				{
					role: "user",
				},
				(item) => {
					messages.push({
						id: item.id ?? `user-${index}`,
						role: "user",
						parts: [
							{
								id: `${item.id ?? `user-${index}`}-text-0`,
								type: "text" satisfies AssistantChatPartTypeEnumSchema.Type,
								text: getUserMessageText({
									content: item.content,
								}),
							},
						],
					});
				},
			)
			.with(
				{
					role: "system",
				},
				(item) => {
					messages.push({
						id: item.id ?? `system-${index}`,
						role: "system",
						parts: [
							{
								id: `${item.id ?? `system-${index}`}-text-0`,
								type: "text" satisfies AssistantChatPartTypeEnumSchema.Type,
								text: getSystemMessageText({
									content: item.content,
								}),
							},
						],
					});
				},
			)
			.with(
				{
					role: "assistant",
				},
				(item) => {
					const message = ensureAssistantMessage({
						messages,
						id: item.id ?? `assistant-${index}`,
					});
					const textParts = getAssistantTextParts({
						content: item.content,
						messageId: message.id,
					});

					if (textParts.length === 0 && message.parts.length === 0) {
						message.parts.push({
							id: `${message.id}-text-empty`,
							type: "text" satisfies AssistantChatPartTypeEnumSchema.Type,
							text: "",
						});
					}

					for (const part of textParts) {
						message.parts = upsertAssistantChatPart({
							message,
							part,
						}).parts;
					}
				},
			)
			.with(
				{
					type: "reasoning",
				},
				(item) => {
					const message = ensureAssistantMessage({
						messages,
						id: item.id ?? `assistant-reasoning-${index}`,
					});
					const text = getReasoningText({
						item,
					});

					message.parts = replaceAssistantChatReasoning({
						message,
						delta: {
							partId: item.id ?? `${message.id}-reasoning-${index}`,
							text,
						},
					}).parts;
				},
			)
			.with(
				{
					type: "function_call",
				},
				(item) => {
					const message = ensureAssistantMessage({
						messages,
						id: `assistant-tool-${index}`,
					});

					message.parts = upsertAssistantChatToolCall({
						message,
						patch: {
							id: item.callId,
							toolName: item.name,
							status: item.status ?? "in_progress",
							input: item.arguments,
						},
					}).parts;
				},
			)
			.with(
				{
					type: "function_call_result",
				},
				(item) => {
					const message = ensureAssistantMessage({
						messages,
						id: `assistant-tool-result-${index}`,
					});

					message.parts = upsertAssistantChatToolCall({
						message,
						patch: {
							id: item.callId,
							toolName: item.name,
							status: item.status,
							output: toAssistantChatDisplayText({
								value: item.output,
							}),
						},
					}).parts;
				},
			)
			.with(
				{
					type: "tool_search_call",
				},
				(item) => {
					const message = ensureAssistantMessage({
						messages,
						id: `assistant-search-${index}`,
					});
					const toolCallId = resolveToolSearchCallId(item, () => {
						return `tool-search-${index}`;
					});

					message.parts = upsertAssistantChatToolCall({
						message,
						patch: {
							id: toolCallId,
							toolName: "tool_search",
							status: normalizeAssistantChatStatus({
								status: item.status,
							}),
							input: toAssistantChatDisplayText({
								value: item.arguments,
							}),
						},
					}).parts;
				},
			)
			.with(
				{
					type: "tool_search_output",
				},
				(item) => {
					const message = ensureAssistantMessage({
						messages,
						id: `assistant-search-output-${index}`,
					});
					const toolCallId = resolveToolSearchCallId(item, () => {
						return `tool-search-${index}`;
					});

					message.parts = upsertAssistantChatToolCall({
						message,
						patch: {
							id: toolCallId,
							toolName: "tool_search",
							status: normalizeAssistantChatStatus({
								status: item.status ?? "completed",
							}),
							output: toAssistantChatDisplayText({
								value: item.tools,
							}),
						},
					}).parts;
				},
			)
			.otherwise(() => {
				//
			});
	}

	return messages;
};

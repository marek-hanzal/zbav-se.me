import { match } from "ts-pattern";
import type { AgentLiveVisualItem } from "./AgentLiveVisualItem";

export const withMergedAgentLiveItem = ({
	current,
	next,
}: {
	current: AgentLiveVisualItem.Value | undefined;
	next: AgentLiveVisualItem.Value;
}): AgentLiveVisualItem.Value => {
	return match<
		[
			AgentLiveVisualItem.Value | undefined,
			AgentLiveVisualItem.Value,
		],
		AgentLiveVisualItem.Value
	>([
		current,
		next,
	])
		.with(
			[
				{
					type: "message",
					role: "assistant",
				},
				{
					type: "message",
					role: "assistant",
				},
			],
			([current, next]) => {
				return {
					...current,
					...next,
					content: next.content.length > 0 ? next.content : current.content,
				};
			},
		)
		.with(
			[
				{
					type: "function_call",
				},
				{
					type: "function_call",
				},
			],
			([current, next]) => {
				return {
					...current,
					...next,
					id: next.id ?? current.id,
					namespace: next.namespace ?? current.namespace,
					arguments: next.arguments.length > 0 ? next.arguments : current.arguments,
					status: next.status ?? current.status,
				};
			},
		)
		.with(
			[
				{
					type: "function_call_output",
				},
				{
					type: "function_call_output",
				},
			],
			([current, next]) => {
				return {
					...current,
					...next,
					output: hasValue(next.output) ? next.output : current.output,
				};
			},
		)
		.with(
			[
				{
					type: "tool_search_call",
				},
				{
					type: "tool_search_call",
				},
			],
			([current, next]) => {
				return {
					...current,
					...next,
					call_id: next.call_id ?? current.call_id,
					arguments: hasValue(next.arguments) ? next.arguments : current.arguments,
				};
			},
		)
		.with(
			[
				{
					type: "tool_search_output",
				},
				{
					type: "tool_search_output",
				},
			],
			([current, next]) => {
				return {
					...current,
					...next,
					call_id: next.call_id ?? current.call_id,
					tools: next.tools.length > 0 ? next.tools : current.tools,
				};
			},
		)
		.otherwise(([, next]) => next);
};

const hasValue = (value: unknown): boolean => {
	if (Array.isArray(value)) {
		return value.length > 0;
	}

	if (typeof value === "string") {
		return value.length > 0;
	}

	return value !== undefined && value !== null;
};

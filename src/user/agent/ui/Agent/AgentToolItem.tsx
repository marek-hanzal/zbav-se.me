import type {
	FunctionCallItem,
	FunctionCallResultItem,
	ToolSearchCallItem,
	ToolSearchOutputItem,
} from "@openai/agents-core";
import type {
	ResponseFunctionToolCall,
	ResponseFunctionToolCallOutputItem,
	ResponseToolSearchCall,
	ResponseToolSearchOutputItem,
} from "openai/resources/responses/responses";
import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";

type AgentTool =
	| FunctionCallItem
	| FunctionCallResultItem
	| ToolSearchCallItem
	| ToolSearchOutputItem
	| ResponseFunctionToolCall
	| ResponseFunctionToolCallOutputItem
	| ResponseToolSearchCall
	| ResponseToolSearchOutputItem;

export namespace AgentToolItem {
	export interface Props extends Container.Props {
		item: AgentTool;
	}
}

export const AgentToolItem: FC<AgentToolItem.Props> = ({ item, ui, ...props }) => {
	const title = getTitle(item);
	const label = getLabel(item);
	const meta = getMeta(item);
	const body = getBody(item);

	return (
		<Container
			data-ui={"AgentToolItem"}
			ui={{
				background: "alt",
				border: true,
				round: "default",
				inner: "default",
				flow: "vertical",
				gap: "xs",
				...ui,
			}}
			className={[
				"max-w-[min(48rem,100%)]",
			]}
			{...props}
		>
			<div className={"text-xs font-semibold uppercase opacity-60"}>{label}</div>

			<div className={"text-sm font-semibold"}>{title}</div>

			{meta ? <div className={"text-xs opacity-60"}>{meta}</div> : null}

			<pre className={"whitespace-pre-wrap break-words text-sm"}>{body}</pre>
		</Container>
	);
};

const getTitle = (item: AgentTool): string => {
	return match(item)
		.with(
			{
				type: "function_call",
			},
			(item) => getFunctionName(item.namespace, item.name),
		)
		.with(
			{
				type: "function_call_result",
			},
			(item) => getFunctionName(item.namespace, item.name),
		)
		.with(
			{
				type: "function_call_output",
			},
			(item) => item.call_id,
		)
		.with(
			{
				type: "tool_search_call",
			},
			() => "Tool search",
		)
		.with(
			{
				type: "tool_search_output",
			},
			(item) => `${item.tools.length} tool${item.tools.length === 1 ? "" : "s"}`,
		)
		.exhaustive();
};

const getLabel = (item: AgentTool): string => {
	return match(item)
		.with(
			{
				type: "function_call",
			},
			() => "Tool call",
		)
		.with(
			{
				type: "function_call_result",
			},
			() => "Tool output",
		)
		.with(
			{
				type: "function_call_output",
			},
			() => "Tool output",
		)
		.with(
			{
				type: "tool_search_call",
			},
			() => "Tool search",
		)
		.with(
			{
				type: "tool_search_output",
			},
			() => "Tool search output",
		)
		.exhaustive();
};

const getMeta = (item: AgentTool): string | null => {
	const parts = match(item)
		.with(
			{
				type: "function_call",
			},
			(item) => [
				getFunctionCallId(item),
				item.status,
			],
		)
		.with(
			{
				type: "function_call_result",
			},
			(item) => [
				item.callId,
				item.status,
			],
		)
		.with(
			{
				type: "function_call_output",
			},
			(item) => [
				item.call_id,
				item.status,
			],
		)
		.with(
			{
				type: "tool_search_call",
			},
			(item) => [
				getToolSearchCallId(item),
				item.execution,
				item.status,
			],
		)
		.with(
			{
				type: "tool_search_output",
			},
			(item) => [
				getToolSearchCallId(item),
				item.execution,
				item.status,
			],
		)
		.exhaustive()
		.filter((part): part is string => Boolean(part));

	return parts.length > 0 ? parts.join(" · ") : null;
};

const getBody = (item: AgentTool): string => {
	return match(item)
		.with(
			{
				type: "function_call",
			},
			(item) => formatValue(item.arguments),
		)
		.with(
			{
				type: "function_call_result",
			},
			(item) => formatValue(item.output),
		)
		.with(
			{
				type: "function_call_output",
			},
			(item) => formatValue(item.output),
		)
		.with(
			{
				type: "tool_search_call",
			},
			(item) => formatValue(item.arguments),
		)
		.with(
			{
				type: "tool_search_output",
			},
			(item) => formatValue(item.tools),
		)
		.exhaustive();
};

const getFunctionName = (namespace: string | undefined, name: string): string => {
	return namespace ? `${namespace}.${name}` : name;
};

const getFunctionCallId = (item: FunctionCallItem | ResponseFunctionToolCall): string => {
	return "callId" in item ? item.callId : item.call_id;
};

const getToolSearchCallId = (
	item:
		| ToolSearchCallItem
		| ToolSearchOutputItem
		| ResponseToolSearchCall
		| ResponseToolSearchOutputItem,
): string | null => {
	return "callId" in item ? (item.callId ?? item.call_id ?? null) : (item.call_id ?? null);
};

const formatValue = (value: unknown): string => {
	if (typeof value === "string") {
		try {
			return JSON.stringify(JSON.parse(value), null, 2);
		} catch {
			return value;
		}
	}

	return JSON.stringify(value, null, 2);
};

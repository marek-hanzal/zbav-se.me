import type { AgentInputItem } from "@openai/agents-core";
import type { FC } from "react";
import { match, P } from "ts-pattern";
import type { Container } from "@/lib/client/container";
import { AgentAssistantMessageItem } from "./AgentAssistantMessageItem";
import { AgentRawItem } from "./AgentRawItem";
import { AgentToolItem } from "./AgentToolItem";
import { AgentUserMessageItem } from "./AgentUserMessageItem";

export namespace AgentHistoryItem {
	export interface Props extends Container.Props {
		item: AgentInputItem;
	}
}

export const AgentHistoryItem: FC<AgentHistoryItem.Props> = ({ item, ui, ...props }) => {
	return match(item)
		.with(
			{
				role: "user",
			},
			(item) => {
				return (
					<AgentUserMessageItem
						item={item}
						ui={ui}
						{...props}
					/>
				);
			},
		)
		.with(
			{
				role: "assistant",
			},
			(item) => {
				return (
					<AgentAssistantMessageItem
						item={item}
						ui={ui}
						{...props}
					/>
				);
			},
		)
		.with(
			{
				role: "system",
			},
			() => null,
		)
		.with(
			{
				type: "reasoning",
			},
			() => null,
		)
		.with(
			{
				type: P.union(
					"function_call",
					"function_call_result",
					"tool_search_call",
					"tool_search_output",
				),
			},
			(item) => {
				return (
					<AgentToolItem
						item={item}
						ui={ui}
						{...props}
					/>
				);
			},
		)
		.otherwise((item) => {
			return (
				<AgentRawItem
					item={item}
					ui={ui}
					{...props}
				/>
			);
		});
};

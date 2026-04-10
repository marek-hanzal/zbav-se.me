import type { FC } from "react";
import { match, P } from "ts-pattern";
import type { Container } from "@/lib/client/container";
import { translator } from "@/lib/common/translator";
import { withAgentLiveItemQuery } from "~/user/agent/query/withAgentLiveItemQuery";
import { AgentAssistantMessageItem } from "./AgentAssistantMessageItem";
import { AgentPendingAssistantItem } from "./AgentPendingAssistantItem";
import { AgentRawItem } from "./AgentRawItem";
import { AgentToolItem } from "./AgentToolItem";

export namespace AgentLiveItem {
	export interface Props extends Container.Props {
		itemId: string;
		runId: string;
	}
}

export const AgentLiveItem: FC<AgentLiveItem.Props> = ({ itemId, runId, ui, ...props }) => {
	const { data: item } = withAgentLiveItemQuery.useQuery({
		runId,
		itemId,
	});

	if (!item) {
		return null;
	}

	return match(item)
		.with(
			{
				type: "message",
				role: "assistant",
			},
			(item) => {
				if (item.status === "in_progress" && item.content.length === 0) {
					return null;
				}

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
				type: "reasoning",
			},
			(item) => {
				if (item.status !== "in_progress") {
					return null;
				}

				return (
					<AgentPendingAssistantItem
						text={translator.text("Agent thinking", "Premyslim")}
						ui={ui}
						{...props}
					/>
				);
			},
		)
		.with(
			{
				type: P.union(
					"function_call",
					"function_call_output",
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

import { useQueries } from "@tanstack/react-query";
import type { FC } from "react";
import { translator } from "@/lib/common/translator";
import type { agentLiveStreamState } from "~/user/agent/fn/agentLiveStreamState";
import { withAgentLiveItemQuery } from "~/user/agent/query/withAgentLiveItemQuery";
import { AgentPendingAssistantItem } from "./AgentPendingAssistantItem";

export namespace AgentLiveRunActivity {
	export interface Props {
		itemIds: string[];
		runId: string;
		status: agentLiveStreamState.RunStatus;
	}
}

export const AgentLiveRunActivity: FC<AgentLiveRunActivity.Props> = ({
	itemIds,
	runId,
	status,
}) => {
	const itemQueries = useQueries({
		queries: itemIds.map((itemId) =>
			withAgentLiveItemQuery.options({
				runId,
				itemId,
			}),
		),
	});

	if (status !== "streaming") {
		return null;
	}

	const items = itemQueries
		.map((query) => query.data)
		.filter((item): item is agentLiveStreamState.ItemState => Boolean(item));
	const hasAssistantContent = items.some((item) => {
		return item.type === "message" && item.role === "assistant" && item.content.length > 0;
	});
	const hasReasoning = items.some((item) => item.type === "reasoning");
	const hasInProgressReasoning = items.some((item) => {
		return item.type === "reasoning" && item.status === "in_progress";
	});
	const hasInProgressTool = items.some((item) => {
		return (
			(item.type === "function_call" ||
				item.type === "function_call_output" ||
				item.type === "tool_search_call" ||
				item.type === "tool_search_output") &&
			item.status === "in_progress"
		);
	});

	if (hasInProgressReasoning || (hasReasoning && !hasAssistantContent && !hasInProgressTool)) {
		return <AgentPendingAssistantItem text={translator.text("Agent thinking", "Premyslim")} />;
	}

	if (hasInProgressTool) {
		return (
			<AgentPendingAssistantItem
				text={translator.text("Agent using tool", "Pracuju s nastrojem")}
			/>
		);
	}

	if (itemIds.length === 0) {
		return <AgentPendingAssistantItem />;
	}

	return null;
};

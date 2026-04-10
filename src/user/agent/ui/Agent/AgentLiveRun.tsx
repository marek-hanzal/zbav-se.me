import type { UserMessageItem } from "@openai/agents-core";
import type { FC } from "react";
import type { Container } from "@/lib/client/container";
import { withAgentLiveRunQuery } from "~/user/agent/query/withAgentLiveRunQuery";
import { AgentLiveItem } from "./AgentLiveItem";
import { AgentLiveRunActivity } from "./AgentLiveRunActivity";
import { AgentLiveRunNotice } from "./AgentLiveRunNotice";
import { AgentUserMessageItem } from "./AgentUserMessageItem";

export namespace AgentLiveRun {
	export interface Props extends Container.Props {
		runId: string;
	}
}

export const AgentLiveRun: FC<AgentLiveRun.Props> = ({ runId, ui, ...props }) => {
	const { data: run } = withAgentLiveRunQuery.useQuery({
		runId,
	});

	if (!run) {
		return null;
	}

	const userItem = {
		type: "message",
		role: "user",
		content: run.userText,
	} satisfies UserMessageItem;

	return (
		<>
			<AgentUserMessageItem
				item={userItem}
				ui={ui}
				{...props}
			/>

			<AgentLiveRunActivity
				runId={runId}
				itemIds={run.itemIds}
				status={run.status}
			/>

			{run.itemIds.map((itemId) => {
				return (
					<AgentLiveItem
						key={`${runId}-${itemId}`}
						runId={runId}
						itemId={itemId}
						ui={ui}
						{...props}
					/>
				);
			})}

			{run.notice ? (
				<AgentLiveRunNotice
					kind={run.notice}
					ui={ui}
					{...props}
				/>
			) : null}
		</>
	);
};

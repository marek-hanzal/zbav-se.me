import type { UserMessageItem } from "@openai/agents-core";
import type { FC } from "react";
import type { Container } from "@/lib/client/container";
import { useAgentLiveStore } from "~/user/agent/store/useAgentLiveStore";
import { AgentLiveItem } from "./AgentLiveItem";
import { AgentLiveRunActivity } from "./AgentLiveRunActivity";
import { AgentLiveRunNotice } from "./AgentLiveRunNotice";
import { AgentUserMessageItem } from "./AgentUserMessageItem";

export namespace AgentLiveRun {
	export interface Props extends Container.Props {
		runId: string;
	}
}

const EMPTY_SLOT_IDS: string[] = [];

export const AgentLiveRun: FC<AgentLiveRun.Props> = ({ runId, ui, ...props }) => {
	const userText = useAgentLiveStore((state) => state.runById[runId]?.userText);
	const orderedSlotIds = useAgentLiveStore((state) => {
		return state.runById[runId]?.orderedSlotIds ?? EMPTY_SLOT_IDS;
	});
	const notice = useAgentLiveStore((state) => state.runById[runId]?.notice);

	if (!userText) {
		return null;
	}

	const userItem = {
		type: "message",
		role: "user",
		content: userText,
	} satisfies UserMessageItem;

	return (
		<>
			<AgentUserMessageItem
				item={userItem}
				ui={ui}
				{...props}
			/>

			<AgentLiveRunActivity runId={runId} />

			{orderedSlotIds.map((slotId) => {
				return (
					<AgentLiveItem
						key={slotId}
						slotId={slotId}
						ui={ui}
						{...props}
					/>
				);
			})}

			{notice ? (
				<AgentLiveRunNotice
					kind={notice}
					ui={ui}
					{...props}
				/>
			) : null}
		</>
	);
};

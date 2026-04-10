import type { FC } from "react";
import { match } from "ts-pattern";
import { translator } from "@/lib/common/translator";
import { useAgentLiveStore } from "~/user/agent/store/useAgentLiveStore";
import { AgentPendingAssistantItem } from "./AgentPendingAssistantItem";

export namespace AgentLiveRunActivity {
	export interface Props {
		runId: string;
	}
}

export const AgentLiveRunActivity: FC<AgentLiveRunActivity.Props> = ({ runId }) => {
	const kind = useAgentLiveStore((state) => state.runById[runId]?.activity.kind);
	const notice = useAgentLiveStore((state) => state.runById[runId]?.notice);

	if (!kind || notice) {
		return null;
	}

	return match(kind)
		.with("thinking", () => {
			return (
				<AgentPendingAssistantItem text={translator.text("Agent thinking", "Premyslim")} />
			);
		})
		.with("tool", () => {
			return (
				<AgentPendingAssistantItem
					text={translator.text("Agent using tool", "Pracuju s nastrojem")}
				/>
			);
		})
		.with("pending", () => <AgentPendingAssistantItem />)
		.otherwise(() => null);
};

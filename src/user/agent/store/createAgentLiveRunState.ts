import type { AgentLiveRunState } from "./AgentLiveRunState";
import { createAgentLiveActivityState } from "./createAgentLiveActivityState";

export const createAgentLiveRunState = ({
	runId,
	userText,
}: {
	runId: string;
	userText: string;
}): AgentLiveRunState.Value => {
	return {
		runId,
		userText,
		orderedSlotIds: [],
		slotIdByOutputIndex: {},
		slotIdByItemId: {},
		status: "streaming",
		activity: createAgentLiveActivityState(),
	};
};

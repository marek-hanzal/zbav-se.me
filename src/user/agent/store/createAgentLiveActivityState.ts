import type { AgentLiveActivityState } from "./AgentLiveActivityState";

export const createAgentLiveActivityState = (): AgentLiveActivityState.Value => {
	return {
		kind: "pending",
		reasoningStatusByItemId: {},
	};
};

import type { AgentLiveStore } from "./AgentLiveStore";
import { createAgentLiveRunState } from "./createAgentLiveRunState";

export const seedAgentLiveRun = ({
	state,
	runId,
	userText,
}: {
	state: AgentLiveStore.State;
	runId: string;
	userText: string;
}): Partial<AgentLiveStore.State> => {
	if (state.runById[runId]) {
		return {};
	}

	return {
		runIds: [
			...state.runIds,
			runId,
		],
		runById: {
			...state.runById,
			[runId]: createAgentLiveRunState({
				runId,
				userText,
			}),
		},
	};
};

import type { AgentLiveStore } from "./AgentLiveStore";
import { withAgentLiveRunStatus } from "./withAgentLiveRunStatus";

export const markAgentLiveRun = ({
	state,
	runId,
	status,
}: {
	state: AgentLiveStore.State;
	runId: string;
	status: AgentLiveStore.TerminalStatus;
}): Partial<AgentLiveStore.State> => {
	const run = state.runById[runId];

	if (!run) {
		return {};
	}

	return {
		runById: {
			...state.runById,
			[runId]: withAgentLiveRunStatus({
				run,
				status,
			}),
		},
	};
};

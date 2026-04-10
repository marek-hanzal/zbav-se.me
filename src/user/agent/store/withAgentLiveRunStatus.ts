import type { AgentLiveRunState } from "./AgentLiveRunState";
import { withAgentLiveNotice } from "./withAgentLiveNotice";

export const withAgentLiveRunStatus = ({
	run,
	status,
}: {
	run: AgentLiveRunState.Value;
	status: AgentLiveRunState.Status;
}): AgentLiveRunState.Value => {
	return {
		...run,
		status,
		notice: withAgentLiveNotice(status),
		activity: {
			kind: "idle",
			reasoningStatusByItemId: {},
		},
	};
};

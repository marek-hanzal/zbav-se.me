import { match } from "ts-pattern";
import type { AgentLiveRunState } from "./AgentLiveRunState";

export const withAgentLiveNotice = (
	status: AgentLiveRunState.Status,
): AgentLiveRunState.Notice | undefined => {
	return match(status)
		.with("cancelled", "failed", "incomplete", (value) => value)
		.otherwise(() => undefined);
};

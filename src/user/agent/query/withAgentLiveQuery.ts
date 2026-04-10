import { withQuery } from "@/lib/client/query";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";

export const withAgentLiveQuery = withQuery<void, AgentEvent[]>({
	keys: () => [
		"agent",
		"live",
	],
	async queryFn() {
		return [];
	},
});

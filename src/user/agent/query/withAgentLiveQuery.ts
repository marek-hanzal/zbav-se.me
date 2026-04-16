import type { RunStreamEvent } from "@openai/agents";
import { withQuery } from "@/lib/client/query";

export const withAgentLiveQuery = withQuery<void, RunStreamEvent[]>({
	keys: () => [
		"agent",
		"live",
	],
	async queryFn() {
		return [];
	},
});

import type { RunStreamEvent } from "@openai/agents";
import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";

export const withAgentLiveQuery = withQuery<void, RunStreamEvent[]>({
	logger: getRootLogger([
		"query",
		"withAgentLiveQuery",
	]),
	keys: () => [
		"agent",
		"live",
	],
	async queryFn() {
		return [];
	},
});

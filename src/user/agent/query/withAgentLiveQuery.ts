import type { RunStreamEvent } from "@openai/agents";
import { getRootLogger } from "@/lib/client/log";
import { withQuery } from "@/lib/client/query";

const logger = getRootLogger([
	"query",
	"withAgentLiveQuery",
]);

export const withAgentLiveQuery = withQuery<void, RunStreamEvent[]>({
	keys: () => [
		"agent",
		"live",
	],
	async queryFn() {
		logger.trace("queryFn");

		return [];
	},
});

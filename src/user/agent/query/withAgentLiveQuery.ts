import type { RunStreamEvent } from "@openai/agents";
import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";

export const withAgentLiveQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withAgentLiveQuery",
	]),
	keys: () => [
		"agent",
		"live",
	],
	async queryFn(_data: "No input data here, bro"): Promise<RunStreamEvent[]> {
		return [];
	},
});

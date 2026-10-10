import type { RunStreamEvent } from "@openai/agents";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";

export namespace withAgentLiveQuery {
	export interface Data {
		threadId: string;
	}
}

export const withAgentLiveQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withAgentLiveQuery",
	]),
	keys: (data: withAgentLiveQuery.Data) => [
		"agent",
		"live",
		data,
	],
	async queryFn(_data: withAgentLiveQuery.Data): Promise<RunStreamEvent[]> {
		return [];
	},
});

import type { RunStreamEvent } from "@openai/agents";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";

export namespace withAgentLiveQuery {
	export interface Data {
		threadId: string;
	}
}

export const withAgentLiveQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withAgentLiveQuery",
	]),
	keysFn: (data: withAgentLiveQuery.Data) => [
		"agent",
		"live",
		data,
	],
	async queryFn(_data: withAgentLiveQuery.Data): Promise<RunStreamEvent[]> {
		return [];
	},
});

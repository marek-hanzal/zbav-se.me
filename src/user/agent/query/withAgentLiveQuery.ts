import type { RunStreamEvent } from "@openai/agents";
import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";

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

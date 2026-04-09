import { withQuery } from "@/lib/client/query";
import type { agentLiveStreamState } from "~/user/agent/fn/agentLiveStreamState";

export namespace withAgentLiveRunQuery {
	export interface Data {
		runId: string;
	}

	export type State = agentLiveStreamState.RunState;
}

export const withAgentLiveRunQuery = withQuery<
	withAgentLiveRunQuery.Data,
	withAgentLiveRunQuery.State | undefined
>({
	keys(data) {
		return [
			"agent",
			"live",
			"run",
			data?.runId,
		];
	},
	async queryFn() {
		return undefined;
	},
	defaultOptions: {
		staleTime: Infinity,
		gcTime: 5 * 60 * 1_000,
	},
});

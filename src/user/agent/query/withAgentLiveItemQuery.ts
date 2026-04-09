import { withQuery } from "@/lib/client/query";
import type { agentLiveStreamState } from "~/user/agent/fn/agentLiveStreamState";

export namespace withAgentLiveItemQuery {
	export interface Data {
		itemId: string;
		runId: string;
	}

	export type State = agentLiveStreamState.ItemState;
}

export const withAgentLiveItemQuery = withQuery<
	withAgentLiveItemQuery.Data,
	withAgentLiveItemQuery.State | undefined
>({
	keys(data) {
		return [
			"agent",
			"live",
			"item",
			data?.runId,
			data?.itemId,
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

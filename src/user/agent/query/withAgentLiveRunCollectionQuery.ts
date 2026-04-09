import { withQuery } from "@/lib/client/query";

export const withAgentLiveRunCollectionQuery = withQuery<void, string[]>({
	keys() {
		return [
			"agent",
			"live",
			"run-collection",
		];
	},
	async queryFn() {
		return [];
	},
	defaultOptions: {
		initialData: [],
		staleTime: Infinity,
		gcTime: 5 * 60 * 1_000,
	},
});

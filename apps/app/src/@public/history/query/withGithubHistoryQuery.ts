import { withQuery } from "@use-pico/client/query";
import { historyFn } from "~/@public/github/server/fn/historyFn";
import type { GitHubHistorySchema } from "~/@public/github/server/schema/GitHubHistorySchema";

type GithubHistoryQuery = {
	weeks: number;
};

export const withGithubHistoryQuery = withQuery<GithubHistoryQuery, GitHubHistorySchema.Type[]>({
	keys(data) {
		return [
			"github",
			"history",
			data,
		];
	},
	async queryFn(data) {
		return historyFn({
			data,
		});
	},
});

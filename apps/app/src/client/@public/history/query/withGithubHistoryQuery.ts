import { withQuery } from "@use-pico/client/query";
import { historyFn } from "~/server/@public/github/fn/historyFn";
import type { GitHubHistorySchema } from "~/server/@public/github/schema/GitHubHistorySchema";

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

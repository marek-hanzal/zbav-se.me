import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { historyFn } from "~/public-github/fn/historyFn";
import type { GitHubHistorySchema } from "~/public-github/schema/GitHubHistorySchema";
import { withQueryFn } from "~/query/fn/withQueryFn";

type GithubHistoryQuery = {
	weeks: number;
};

export const withGithubHistoryQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withGithubHistoryQuery",
	]),
	keysFn(data: GithubHistoryQuery) {
		return [
			"github",
			"history",
			data,
		];
	},
	async queryFn(data: GithubHistoryQuery): Promise<GitHubHistorySchema.Type[]> {
		return historyFn({
			data,
		});
	},
});

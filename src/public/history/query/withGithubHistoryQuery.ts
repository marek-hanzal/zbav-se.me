import { getRootLogger } from "~/common/log/getRootLogger";
import { historyFn } from "~/public/github/fn/historyFn";
import type { GitHubHistorySchema } from "~/public/github/server/schema/GitHubHistorySchema";
import { withQuery } from "~/query/fn/withQuery";

type GithubHistoryQuery = {
	weeks: number;
};

export const withGithubHistoryQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withGithubHistoryQuery",
	]),
	keys(data: GithubHistoryQuery) {
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

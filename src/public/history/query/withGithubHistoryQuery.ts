import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { historyFn } from "~/public/github/fn/historyFn";
import type { GitHubHistorySchema } from "~/public/github/server/schema/GitHubHistorySchema";

type GithubHistoryQuery = {
	weeks: number;
};

export const withGithubHistoryQuery = withQuery<GithubHistoryQuery, GitHubHistorySchema.Type[]>({
	logger: getRootLogger([
		"query",
		"withGithubHistoryQuery",
	]),
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

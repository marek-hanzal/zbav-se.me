import { getRootLogger } from "@/lib/client/log";
import { withQuery } from "@/lib/client/query";
import { historyFn } from "~/public/github/fn/historyFn";
import type { GitHubHistorySchema } from "~/public/github/server/schema/GitHubHistorySchema";

type GithubHistoryQuery = {
	weeks: number;
};

const logger = getRootLogger([
	"query",
	"withGithubHistoryQuery",
]);

export const withGithubHistoryQuery = withQuery<GithubHistoryQuery, GitHubHistorySchema.Type[]>({
	keys(data) {
		return [
			"github",
			"history",
			data,
		];
	},
	async queryFn(data) {
		logger.trace("queryFn", data);

		return historyFn({
			data,
		});
	},
});

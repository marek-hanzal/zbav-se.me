import { getRootLogger } from "@/lib/client/log";
import { withQuery } from "@/lib/client/query";
import { agentUsageCollectionFn } from "~/user/agent/fn/agentUsageCollectionFn";
import type { AgentUsageQuerySchema } from "~/user/agent/server/schema/AgentUsageQuerySchema";
import type { AgentUsageSchema } from "~/user/agent/server/schema/AgentUsageSchema";

const logger = getRootLogger([
	"query",
	"withAgentTokensQuery",
]);

export const withAgentTokensQuery = withQuery<
	AgentUsageQuerySchema.Type,
	Pick<AgentUsageSchema.Type, "input" | "output" | "total">
>({
	keys(data) {
		return [
			"agent",
			"usage",
			"tokens",
			data,
		];
	},
	async queryFn(data) {
		logger.trace("queryFn", data);

		const source = await agentUsageCollectionFn({
			data,
		});

		return {
			total: source.reduce((acc, item) => {
				return acc + item.total;
			}, 0),
			input: source.reduce((acc, item) => {
				return acc + item.input;
			}, 0),
			output: source.reduce((acc, item) => {
				return acc + item.output;
			}, 0),
		} as const;
	},
});

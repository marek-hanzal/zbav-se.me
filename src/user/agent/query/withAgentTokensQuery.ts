import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { agentUsageCollectionFn } from "~/user/agent/fn/agentUsageCollectionFn";
import type { AgentUsageQuerySchema } from "~/user/agent/server/schema/AgentUsageQuerySchema";
import type { AgentUsageSchema } from "~/user/agent/server/schema/AgentUsageSchema";

export const withAgentTokensQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withAgentTokensQuery",
	]),
	errors: {} as {
		query: agentUsageCollectionFn.Error;
	},
	keys(data) {
		return [
			"agent",
			"usage",
			"tokens",
			data,
		];
	},
	async queryFn(
		data: AgentUsageQuerySchema.Type,
	): Promise<Pick<AgentUsageSchema.Type, "input" | "output" | "total">> {
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

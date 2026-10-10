import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import { agentUsageCollectionFn } from "~/user-agent/fn/agentUsageCollectionFn";
import type { AgentUsageQuerySchema } from "~/user-agent/schema/AgentUsageQuerySchema";
import type { AgentUsageSchema } from "~/user-agent/schema/AgentUsageSchema";

export const withAgentTokensQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withAgentTokensQuery",
	]),
	errors: {} as {
		query: agentUsageCollectionFn.Error;
	},
	keysFn(data: AgentUsageQuerySchema.Type) {
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

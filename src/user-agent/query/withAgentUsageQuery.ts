import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import { agentUsageCollectionFn } from "~/user-agent/fn/agentUsageCollectionFn";
import type { AgentUsageQuerySchema } from "~/user-agent/schema/AgentUsageQuerySchema";
import type { AgentUsageSchema } from "~/user-agent/schema/AgentUsageSchema";

export const withAgentUsageQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withAgentUsageQuery",
	]),
	errors: {} as {
		query: agentUsageCollectionFn.Error;
	},
	keysFn(data: AgentUsageQuerySchema.Type) {
		return [
			"agent",
			"usage",
			data,
		];
	},
	async queryFn(data: AgentUsageQuerySchema.Type): Promise<AgentUsageSchema.Type[]> {
		return agentUsageCollectionFn({
			data,
		});
	},
});

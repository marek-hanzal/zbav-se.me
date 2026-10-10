import { getRootLogger } from "~/log/fn/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";
import { agentUsageCollectionFn } from "~/user-agent/fn/agentUsageCollectionFn";
import type { AgentUsageQuerySchema } from "~/user-agent/schema/AgentUsageQuerySchema";
import type { AgentUsageSchema } from "~/user-agent/schema/AgentUsageSchema";

export const withAgentUsageQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withAgentUsageQuery",
	]),
	errors: {} as {
		query: agentUsageCollectionFn.Error;
	},
	keys(data: AgentUsageQuerySchema.Type) {
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

import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { agentUsageCollectionFn } from "~/user/agent/fn/agentUsageCollectionFn";
import type { AgentUsageQuerySchema } from "~/user/agent/server/schema/AgentUsageQuerySchema";
import type { AgentUsageSchema } from "~/user/agent/server/schema/AgentUsageSchema";

export const withAgentUsageQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withAgentUsageQuery",
	]),
	errors: {} as {
		query: agentUsageCollectionFn.Error;
	},
	keys(data) {
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

import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { agentUsageCollectionFn } from "~/user/agent/fn/agentUsageCollectionFn";
import type { AgentUsageQuerySchema } from "~/user/agent/server/schema/AgentUsageQuerySchema";
import type { AgentUsageSchema } from "~/user/agent/server/schema/AgentUsageSchema";

export const withAgentUsageQuery = withQuery<AgentUsageQuerySchema.Type, AgentUsageSchema.Type[]>({
	logger: getRootLogger([
		"query",
		"withAgentUsageQuery",
	]),
	keys(data) {
		return [
			"agent",
			"usage",
			data,
		];
	},
	async queryFn(data) {
		return agentUsageCollectionFn({
			data,
		});
	},
});

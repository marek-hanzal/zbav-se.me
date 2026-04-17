import { getRootLogger } from "@/lib/client/log";
import { withQuery } from "@/lib/client/query";
import { agentUsageCollectionFn } from "~/user/agent/fn/agentUsageCollectionFn";
import type { AgentUsageQuerySchema } from "~/user/agent/server/schema/AgentUsageQuerySchema";
import type { AgentUsageSchema } from "~/user/agent/server/schema/AgentUsageSchema";

const logger = getRootLogger([
	"query",
	"withAgentUsageQuery",
]);

export const withAgentUsageQuery = withQuery<AgentUsageQuerySchema.Type, AgentUsageSchema.Type[]>({
	keys(data) {
		return [
			"agent",
			"usage",
			data,
		];
	},
	async queryFn(data) {
		logger.trace("queryFn", data);

		return agentUsageCollectionFn({
			data,
		});
	},
});

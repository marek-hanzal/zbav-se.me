import type { AgentInputItem } from "@openai/agents-core";
import { getRootLogger } from "@/lib/client/log";
import { withQuery } from "@/lib/client/query";
import { agentStreamItemsFn } from "~/user/agent/fn/agentStreamItemsFn";
import type { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";

/**
 * This query provides direct access to AgentInput messages, no more processing is necessary here.
 */
const logger = getRootLogger([
	"query",
	"withAgentStreamItemsQuery",
]);

export const withAgentStreamItemsQuery = withQuery<AgentStreamQuerySchema.Type, AgentInputItem[]>({
	keys: (data) => [
		"agent",
		"stream",
		"items",
		data,
	],
	async queryFn(data) {
		logger.trace("queryFn", data);

		/**
		 * Because TSS is strict about wire-types, we're getting Record from server, thus we've to
		 * recast it to real type.
		 *
		 * This layer is source of truth here, so we're quite safe with this cast.
		 */
		return agentStreamItemsFn({
			data,
		}) as unknown as AgentInputItem[];
	},
});

import type { AgentInputItem } from "@openai/agents-core";
import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { agentStreamItemsFn } from "~/user/agent/fn/agentStreamItemsFn";
import type { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";

/**
 * This query provides direct access to AgentInput messages, no more processing is necessary here.
 */
export const withAgentStreamItemsQuery = withQuery<
	AgentStreamQuerySchema.Type,
	AgentInputItem[],
	agentStreamItemsFn.Error
>({
	logger: getRootLogger([
		"query",
		"withAgentStreamItemsQuery",
	]),
	keys: (data) => [
		"agent",
		"stream",
		"items",
		data,
	],
	async queryFn(data) {
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

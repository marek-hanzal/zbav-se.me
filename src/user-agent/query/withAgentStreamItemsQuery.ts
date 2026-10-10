import type { AgentInputItem } from "@openai/agents-core";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import { agentStreamItemsFn } from "~/user-agent/fn/agentStreamItemsFn";
import type { AgentStreamQuerySchema } from "~/user-agent/schema/AgentStreamQuerySchema";

/**
 * This query provides direct access to AgentInput messages, no more processing is necessary here.
 */
export const withAgentStreamItemsQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withAgentStreamItemsQuery",
	]),
	errors: {} as {
		query: agentStreamItemsFn.Error;
	},
	keysFn: (data) => [
		"agent",
		"stream",
		"items",
		data,
	],
	async queryFn(data: AgentStreamQuerySchema.Type): Promise<AgentInputItem[]> {
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

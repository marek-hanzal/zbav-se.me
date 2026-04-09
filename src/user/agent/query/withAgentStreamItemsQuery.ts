import type { AgentInputItem } from "@openai/agents-core";
import { withQuery } from "@/lib/client/query";
import { agentStreamItemsFn } from "~/user/agent/fn/agentStreamItemsFn";
import type { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";

export const agentStreamItemsQueryData = {
	sort: [
		{
			field: "sort",
			order: "asc",
		},
	],
	cursor: {
		page: 0,
		size: 512,
	},
} satisfies AgentStreamQuerySchema.Type;

/**
 * This query provides direct access to AgentInput messages, no more processing is necessary here.
 */
export const withAgentStreamItemsQuery = withQuery<AgentStreamQuerySchema.Type, AgentInputItem[]>({
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

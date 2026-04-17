import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { agentStreamDeleteCollectionFn } from "~/user/agent/fn/agentStreamDeleteCollectionFn";
import { withAgentStreamItemsQuery } from "~/user/agent/query/withAgentStreamItemsQuery";
import type { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";

export const withAgentStreamDeleteCollectionMutation = withMutation<
	AgentStreamQuerySchema.Type,
	number,
	Error
>({
	logger: getRootLogger([
		"mutation",
		"withAgentStreamDeleteCollectionMutation",
	]),
	keys(variables) {
		return [
			"agent",
			"stream",
			"delete",
			"collection",
			variables,
		];
	},
	async mutationFn(data) {
		return agentStreamDeleteCollectionFn({
			data,
		});
	},
	invalidate: [
		withAgentStreamItemsQuery,
	],
});

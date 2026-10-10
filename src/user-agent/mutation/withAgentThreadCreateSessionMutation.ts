import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { agentThreadCreateSessionFn } from "~/user-agent/fn/agentThreadCreateSessionFn";
import { withAgentLiveQuery } from "~/user-agent/query/withAgentLiveQuery";
import { withAgentStreamItemsQuery } from "~/user-agent/query/withAgentStreamItemsQuery";
import { withAgentThreadQuery } from "~/user-agent/query/withAgentThreadQuery";
import type { AgentThreadCreateSchema } from "~/user-agent/schema/AgentThreadCreateSchema";
import type { AgentThreadSchema } from "~/user-agent/schema/AgentThreadSchema";

export const withAgentThreadCreateSessionMutation = withMutation<
	AgentThreadCreateSchema.Type,
	AgentThreadSchema.Type,
	agentThreadCreateSessionFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withAgentThreadCreateSessionMutation",
	]),
	keys(variables) {
		return [
			"agent",
			"thread",
			"create-session",
			variables,
		];
	},
	async mutationFn(data) {
		return agentThreadCreateSessionFn({
			data,
		});
	},
	invalidate: [
		{
			async invalidate(queryClient) {
				await Promise.all([
					withAgentLiveQuery.invalidate(queryClient),
					withAgentStreamItemsQuery.invalidate(queryClient),
					withAgentThreadQuery.invalidator(queryClient, [
						"collection",
					]),
				]);
			},
		},
	],
});

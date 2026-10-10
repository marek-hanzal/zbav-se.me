import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { agentThreadCreateSessionFn } from "~/user-agent/fn/agentThreadCreateSessionFn";
import { withAgentLiveQuery } from "~/user-agent/query/withAgentLiveQuery";
import { withAgentStreamItemsQuery } from "~/user-agent/query/withAgentStreamItemsQuery";
import { withAgentThreadQuery } from "~/user-agent/query/withAgentThreadQuery";
import type { AgentThreadCreateSchema } from "~/user-agent/schema/AgentThreadCreateSchema";
import type { AgentThreadSchema } from "~/user-agent/schema/AgentThreadSchema";

export const withAgentThreadCreateSessionMutation = withMutationFn<
	AgentThreadCreateSchema.Type,
	AgentThreadSchema.Type,
	agentThreadCreateSessionFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withAgentThreadCreateSessionMutation",
	]),
	keysFn(variables) {
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
			async invalidateFn(queryClient) {
				await Promise.all([
					withAgentLiveQuery.invalidateFn(queryClient),
					withAgentStreamItemsQuery.invalidateFn(queryClient),
					withAgentThreadQuery.invalidatorFn(queryClient, [
						"collection",
					]),
				]);
			},
		},
	],
});

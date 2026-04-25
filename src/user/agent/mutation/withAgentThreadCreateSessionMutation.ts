import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { agentThreadCreateSessionFn } from "~/user/agent/fn/agentThreadCreateSessionFn";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import { withAgentStreamItemsQuery } from "~/user/agent/query/withAgentStreamItemsQuery";
import type { AgentThreadCreateSchema } from "~/user/agent/server/schema/AgentThreadCreateSchema";
import type { AgentThreadSchema } from "~/user/agent/server/schema/AgentThreadSchema";
import { withAgentThreadQuery } from "../query/withAgentThreadQuery";

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

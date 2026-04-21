import { createFileRoute, redirect } from "@tanstack/react-router";
import { withAgentThreadQuery } from "~/user/agent/query/withAgentThreadQuery";
import { AgentThreadPage } from "~/user/agent/ui/AgentThreadPage";

export const Route = createFileRoute("/$locale/app/agent/continue")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const [thread] = await withAgentThreadQuery.ensureCollectionQuery(queryClient, {
			where: {
				archivedAt: "active",
			},
			sort: [
				{
					field: "updatedAt",
					order: "desc",
				},
			],
			cursor: {
				page: 0,
				size: 1,
			},
			limit: 1,
		});

		if (!thread) {
			throw redirect({
				to: "/$locale/app/agent/welcome",
				params: {
					locale,
				},
			});
		}

		throw redirect({
			to: "/$locale/app/agent/$threadId",
			params: {
				locale,
				threadId: thread.id,
			},
		});
	},
	pendingComponent: AgentThreadPage.Fallback,
});

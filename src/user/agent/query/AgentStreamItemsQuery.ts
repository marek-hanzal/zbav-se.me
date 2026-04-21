import type { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";

export const AgentStreamItemsQuery = (threadId: string) =>
	({
		where: {
			threadId,
		},
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
	}) satisfies AgentStreamQuerySchema.Type;

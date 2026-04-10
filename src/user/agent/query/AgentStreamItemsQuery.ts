import type { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";

export const AgentStreamItemsQuery = {
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

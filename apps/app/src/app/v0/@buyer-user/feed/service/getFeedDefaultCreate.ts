import type { tFeedCreate } from "@zbav-se.me/sdk/api/buyer-user";

export const getFeedDefaultCreate = (name: string) =>
	({
		name,
		query: {
			where: {
				withIgnored: false,
			},
			sort: [
				{
					field: "createdAt",
					order: "desc",
				},
				{
					field: "price",
					order: "asc",
				},
				{
					field: "condition",
					order: "desc",
				},
				{
					field: "age",
					order: "desc",
				},
			],
		},
	}) satisfies tFeedCreate;

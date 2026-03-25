import { type tFeedCreate, tFeedTypeEnum } from "@zbav-se.me/sdk/api/buyer";

export const getFeedDefaultCreate = (name: string, type: tFeedTypeEnum = tFeedTypeEnum.user) =>
	({
		type,
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

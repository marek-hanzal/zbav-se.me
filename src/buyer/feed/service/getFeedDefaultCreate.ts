import type { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import type { FeedTypeEnumSchema } from "~/common/feed/enum/FeedTypeEnumSchema";

export const getFeedDefaultCreate = (name: string, type: FeedTypeEnumSchema.Type = "user") =>
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
	}) satisfies FeedCreateSchema.Type;

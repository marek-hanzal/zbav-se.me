import type { FeedCreateSchema } from "~/server/@buyer/feed/schema/FeedCreateSchema";
import type { FeedTypeEnumSchema } from "~/server/database/@enum/FeedTypeEnumSchema";

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

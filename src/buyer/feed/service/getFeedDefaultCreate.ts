import type { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import type { FeedTypeEnumSchema } from "~/common/feed/enum/FeedTypeEnumSchema";

export const getFeedDefaultCreate = (name: string, type: FeedTypeEnumSchema.Type = "user") => {
	return {
		type,
		name,
		query: {
			where: {
				withIgnored: false,
				statusIn: [
					"live",
				],
			},
			sort: [
				{
					field: "createdAt",
					order: "desc",
				},
			],
		},
	} satisfies FeedCreateSchema.Type;
};

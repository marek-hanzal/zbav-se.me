import type { FeedCreateSchema } from "~/buyer-feed/schema/FeedCreateSchema";
import type { FeedTypeEnumSchema } from "~/feed/schema/FeedTypeEnumSchema";

export const getFeedDefaultCreateFn = (name: string, type: FeedTypeEnumSchema.Type = "user") => {
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

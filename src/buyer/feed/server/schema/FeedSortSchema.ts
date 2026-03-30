import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const FeedSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
				"updatedAt",
			])
			.meta({
				id: "FeedSortField",
				description: "Field of the feed sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "FeedSort",
		description: "Sort object for feed collection",
	});

export type FeedSortSchema = typeof FeedSortSchema;

export namespace FeedSortSchema {
	export type Type = z.infer<FeedSortSchema>;
}

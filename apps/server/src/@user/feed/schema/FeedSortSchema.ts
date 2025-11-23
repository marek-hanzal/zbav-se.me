import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "../../../schema/OrderEnumSchema";

export const FeedSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
				"updatedAt",
			])
			.openapi("FeedSortField", {
				description: "Field of the feed sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("FeedSort", {
		description: "Sort object for feed collection",
	});

export type FeedSortSchema = typeof FeedSortSchema;

export namespace FeedSortSchema {
	export type Type = z.infer<FeedSortSchema>;
}

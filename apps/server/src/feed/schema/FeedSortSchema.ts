import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";

export const FeedSortSchema = z
	.object({
		value: z.enum([
			"createdAt",
			"updatedAt",
		]),
		sort: OrderSchema,
	})
	.openapi("FeedSort", {
		description: "Sort object for feed collection",
	});

export type FeedSortSchema = typeof FeedSortSchema;

export namespace FeedSortSchema {
	export type Type = z.infer<FeedSortSchema>;
}

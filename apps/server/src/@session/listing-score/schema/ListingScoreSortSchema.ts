import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common/schema";

export const ListingScoreSortSchema = z
	.object({
		value: z.enum([
			"score",
			"createdAt",
		]),
		sort: OrderSchema,
	})
	.openapi("ListingScoreSort", {
		description: "Sort object for listing score collection",
	});

export type ListingScoreSortSchema = typeof ListingScoreSortSchema;

export namespace ListingScoreSortSchema {
	export type Type = z.infer<ListingScoreSortSchema>;
}

import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const ListingScoreSortSchema = z
	.object({
		field: z
			.enum([
				"score",
				"createdAt",
			])
			.openapi("ListingScoreSortField", {
				description: "Field of the listing score sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("ListingScoreSort", {
		description: "Sort object for listing score collection",
	});

export type ListingScoreSortSchema = typeof ListingScoreSortSchema;

export namespace ListingScoreSortSchema {
	export type Type = z.infer<ListingScoreSortSchema>;
}

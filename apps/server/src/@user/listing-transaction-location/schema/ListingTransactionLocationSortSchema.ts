import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const ListingTransactionLocationSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
				"time",
			])
			.openapi("ListingTransactionLocationSortField", {
				description: "Available sort fields for listing transaction location",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("ListingTransactionLocationSort", {
		description: "Sort parameters for listing transaction location collection",
	});

export type ListingTransactionLocationSortSchema = typeof ListingTransactionLocationSortSchema;

export namespace ListingTransactionLocationSortSchema {
	export type Type = z.infer<ListingTransactionLocationSortSchema>;
}

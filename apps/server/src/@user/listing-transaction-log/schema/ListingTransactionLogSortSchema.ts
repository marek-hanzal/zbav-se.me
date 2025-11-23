import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "../../../schema/OrderEnumSchema";

export const ListingTransactionLogSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("ListingTransactionLogSortField", {
				description: "Field of the listing transaction log sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("ListingTransactionLogSort", {
		description: "Sort object for listing transaction log collection",
	});

export type ListingTransactionLogSortSchema = typeof ListingTransactionLogSortSchema;

export namespace ListingTransactionLogSortSchema {
	export type Type = z.infer<ListingTransactionLogSortSchema>;
}

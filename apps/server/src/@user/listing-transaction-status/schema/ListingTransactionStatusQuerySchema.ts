import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { ListingTransactionStatusFilterSchema } from "./ListingTransactionStatusFilterSchema";
import { ListingTransactionStatusSortSchema } from "./ListingTransactionStatusSortSchema";

export const ListingTransactionStatusQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingTransactionStatusFilterSchema.optional(),
		where: ListingTransactionStatusFilterSchema.openapi("ListingTransactionStatusWhere", {
			description: "App-based filters",
		}).optional(),
		sort: ListingTransactionStatusSortSchema.array().optional(),
	})
	.openapi("ListingTransactionStatusQuery", {
		description: "Query object for listing transaction status",
	});

export type ListingTransactionStatusQuerySchema = typeof ListingTransactionStatusQuerySchema;

export namespace ListingTransactionStatusQuerySchema {
	export type Type = z.infer<ListingTransactionStatusQuerySchema>;
}

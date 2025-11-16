import { z } from "@hono/zod-openapi";
import { CursorSchema } from "../../../schema/CursorSchema";
import { ListingTransactionLogFilterSchema } from "./ListingTransactionLogFilterSchema";
import { ListingTransactionLogSortSchema } from "./ListingTransactionLogSortSchema";

export const ListingTransactionLogQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingTransactionLogFilterSchema.optional(),
		where: ListingTransactionLogFilterSchema.openapi("ListingTransactionLogWhere", {
			description: "App-based filters",
		}).optional(),
		sort: ListingTransactionLogSortSchema.array().optional(),
	})
	.openapi("ListingTransactionLogQuery", {
		description: "Query object for listing transaction log collection",
	});

export type ListingTransactionLogQuerySchema = typeof ListingTransactionLogQuerySchema;

export namespace ListingTransactionLogQuerySchema {
	export type Type = z.infer<ListingTransactionLogQuerySchema>;
}

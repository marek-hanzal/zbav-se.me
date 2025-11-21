import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { ListingTransactionMessageFilterSchema } from "./ListingTransactionMessageFilterSchema";
import { ListingTransactionMessageSortSchema } from "./ListingTransactionMessageSortSchema";

export const ListingTransactionMessageQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingTransactionMessageFilterSchema.optional(),
		where: ListingTransactionMessageFilterSchema.openapi("ListingTransactionMessageWhere", {
			description: "App-based filters",
		}).optional(),
		sort: ListingTransactionMessageSortSchema.array().optional(),
	})
	.openapi("ListingTransactionMessageQuery", {
		description: "Query object for listing transaction message",
	});

export type ListingTransactionMessageQuerySchema = typeof ListingTransactionMessageQuerySchema;

export namespace ListingTransactionMessageQuerySchema {
	export type Type = z.infer<ListingTransactionMessageQuerySchema>;
}

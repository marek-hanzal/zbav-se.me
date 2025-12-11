import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { ListingTransactionFilterSchema } from "./ListingTransactionFilterSchema";
import { ListingTransactionMetaSchema } from "./ListingTransactionMetaSchema";
import { ListingTransactionSortSchema } from "./ListingTransactionSortSchema";

export const ListingTransactionQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingTransactionFilterSchema.optional(),
		where: ListingTransactionFilterSchema.openapi("ListingTransactionWhere", {
			description: "App-based filters",
		}).optional(),
		sort: ListingTransactionSortSchema.array().optional(),
		meta: ListingTransactionMetaSchema.optional(),
	})
	.openapi("ListingTransactionQuery", {
		description: "Query object for listing transaction collection",
	});

export type ListingTransactionQuerySchema = typeof ListingTransactionQuerySchema;

export namespace ListingTransactionQuerySchema {
	export type Type = z.infer<ListingTransactionQuerySchema>;
}

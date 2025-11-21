import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { ListingTransactionLocationFilterSchema } from "./ListingTransactionLocationFilterSchema";
import { ListingTransactionLocationSortSchema } from "./ListingTransactionLocationSortSchema";

export const ListingTransactionLocationQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingTransactionLocationFilterSchema.optional(),
		where: ListingTransactionLocationFilterSchema.openapi("ListingTransactionLocationWhere", {
			description: "App-based filters",
		}).optional(),
		sort: ListingTransactionLocationSortSchema.array().optional(),
	})
	.openapi("ListingTransactionLocationQuery", {
		description: "Query object for listing transaction location",
	});

export type ListingTransactionLocationQuerySchema = typeof ListingTransactionLocationQuerySchema;

export namespace ListingTransactionLocationQuerySchema {
	export type Type = z.infer<ListingTransactionLocationQuerySchema>;
}

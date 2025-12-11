import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { TransactionLocationFilterSchema } from "./TransactionLocationFilterSchema";
import { TransactionLocationSortSchema } from "./TransactionLocationSortSchema";

export const TransactionLocationQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: TransactionLocationFilterSchema.optional(),
		where: TransactionLocationFilterSchema.openapi("TransactionLocationWhere", {
			description: "App-based filters",
		}).optional(),
		sort: TransactionLocationSortSchema.array().optional(),
	})
	.openapi("TransactionLocationQuery", {
		description: "Query object for listing transaction location",
	});

export type TransactionLocationQuerySchema = typeof TransactionLocationQuerySchema;

export namespace TransactionLocationQuerySchema {
	export type Type = z.infer<TransactionLocationQuerySchema>;
}

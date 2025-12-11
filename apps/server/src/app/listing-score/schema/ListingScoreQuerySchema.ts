import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { ListingScoreFilterSchema } from "./ListingScoreFilterSchema";
import { ListingScoreSortSchema } from "./ListingScoreSortSchema";

export const ListingScoreQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingScoreFilterSchema.optional(),
		where: ListingScoreFilterSchema.openapi("ListingScoreWhere", {
			description: "App-based filters",
		}).optional(),
		sort: ListingScoreSortSchema.array().optional(),
	})
	.openapi("ListingScoreQuery", {
		description: "Query object for listing score collection",
	});

export type ListingScoreQuerySchema = typeof ListingScoreQuerySchema;

export namespace ListingScoreQuerySchema {
	export type Type = z.infer<ListingScoreQuerySchema>;
}

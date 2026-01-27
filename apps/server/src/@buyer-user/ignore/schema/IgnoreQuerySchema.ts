import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { IgnoreFilterSchema } from "./IgnoreFilterSchema";
import { IgnoreSortSchema } from "./IgnoreSortSchema";

export const IgnoreQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: IgnoreFilterSchema.optional(),
		where: IgnoreFilterSchema.openapi("IgnoreWhere", {
			description: "App-based filters",
		}).optional(),
		sort: IgnoreSortSchema.array().optional(),
	})
	.openapi("IgnoreQuery", {
		description: "Query object for ignore collection",
	});

export type IgnoreQuerySchema = typeof IgnoreQuerySchema;

export namespace IgnoreQuerySchema {
	export type Type = z.infer<IgnoreQuerySchema>;
}

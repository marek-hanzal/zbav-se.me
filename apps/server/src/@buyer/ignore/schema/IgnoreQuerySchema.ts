import { z } from "@hono/zod-openapi";
import { IgnoreFilterSchema } from "~/@buyer/ignore/schema/IgnoreFilterSchema";
import { IgnoreSortSchema } from "~/@buyer/ignore/schema/IgnoreSortSchema";
import { IgnoreWhereSchema } from "~/@buyer/ignore/schema/IgnoreWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const IgnoreQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: IgnoreFilterSchema.optional(),
		where: IgnoreWhereSchema.optional(),
		sort: IgnoreSortSchema.array().optional(),
	})
	.strip()
	.openapi("IgnoreQuery", {
		description: "Query object for ignore collection",
	});

export type IgnoreQuerySchema = typeof IgnoreQuerySchema;

export namespace IgnoreQuerySchema {
	export type Type = z.infer<IgnoreQuerySchema>;
}

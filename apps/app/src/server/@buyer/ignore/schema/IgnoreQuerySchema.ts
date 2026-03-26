import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/common/schema/CursorSchema";
import { IgnoreFilterSchema } from "~/server/@buyer/ignore/schema/IgnoreFilterSchema";
import { IgnoreSortSchema } from "~/server/@buyer/ignore/schema/IgnoreSortSchema";
import { IgnoreWhereSchema } from "~/server/@buyer/ignore/schema/IgnoreWhereSchema";

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

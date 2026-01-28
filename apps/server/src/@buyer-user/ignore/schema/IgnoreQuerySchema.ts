import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { IgnoreFilterSchema } from "~/@buyer-user/ignore/schema/IgnoreFilterSchema";
import { IgnoreSortSchema } from "~/@buyer-user/ignore/schema/IgnoreSortSchema";
import { IgnoreWhereSchema } from "~/@buyer-user/ignore/schema/IgnoreWhereSchema";

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

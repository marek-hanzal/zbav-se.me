import { z } from "@hono/zod-openapi";
import { IgnoreFilterSchema } from "~/server/@buyer/ignore/schema/IgnoreFilterSchema";

export const IgnoreWhereSchema = z
	.looseObject({
		...IgnoreFilterSchema.shape,
	})
	.strip()
	.openapi("IgnoreWhere", {
		description: "App-based filters",
	});

export type IgnoreWhereSchema = typeof IgnoreWhereSchema;

export namespace IgnoreWhereSchema {
	export type Type = z.infer<IgnoreWhereSchema>;
}

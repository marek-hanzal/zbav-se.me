import { z } from "@hono/zod-openapi";
import { IgnoreFilterSchema } from "~/@buyer-user/ignore/schema/IgnoreFilterSchema";

export const IgnoreWhereSchema = z
	.object({
		...IgnoreFilterSchema.shape,
	})
	.openapi("IgnoreWhere", {
		description: "App-based filters",
	});

export type IgnoreWhereSchema = typeof IgnoreWhereSchema;

export namespace IgnoreWhereSchema {
	export type Type = z.infer<IgnoreWhereSchema>;
}

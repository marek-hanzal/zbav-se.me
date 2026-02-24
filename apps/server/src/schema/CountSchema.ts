import { z } from "@hono/zod-openapi";

export const CountSchema = z
	.object({
		where: z.coerce.number().openapi({
			description: "Count of items based on provided where query.",
			type: "number",
		}),
		filter: z.coerce.number().openapi({
			description: "Count of items based on provided filter query.",
			type: "number",
		}),
		total: z.coerce.number().openapi({
			description: "Total count of items (no filters applied).",
			type: "number",
		}),
		isEmpty: z.boolean().openapi({
			description: "True when total count is empty.",
			type: "boolean",
		}),
		isFilterEmpty: z.boolean().openapi({
			description: "True when filter count is empty while total count has data.",
			type: "boolean",
		}),
	})
	.openapi("Count", {
		description: "Count data",
	});

export type CountSchema = typeof CountSchema;

export namespace CountSchema {
	export type Type = z.infer<CountSchema>;
}

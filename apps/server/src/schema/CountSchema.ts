import { z } from "@hono/zod-openapi";

export const CountSchema = z
	.object({
		where: z.number().openapi({
			description: "Count of items based on provided where query.",
		}),
		filter: z.number().openapi({
			description: "Count of items based on provided filter query.",
		}),
		total: z.number().openapi({
			description: "Total count of items (no filters applied).",
		}),
	})
	.openapi("Count", {
		description: "Complex count of items based on provided query.",
	});

export type CountSchema = typeof CountSchema;

export namespace CountSchema {
	export type Type = z.infer<typeof CountSchema>;
}

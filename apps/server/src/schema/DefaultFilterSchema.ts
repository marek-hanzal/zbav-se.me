import { z } from "@hono/zod-openapi";

export const DefaultFilterSchema = z.object({
	id: z.string().nullish().openapi({
		description: "This filter matches the exact id",
	}),
	idIn: z.array(z.string()).nullish().openapi({
		description: "This filter matches the ids",
	}),
	fulltext: z.string().nullish().openapi({
		description: "Runs fulltext on the collection/query.",
	}),
});

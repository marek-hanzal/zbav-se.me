import { z } from "@hono/zod-openapi";

export const DefaultFilterSchema = z.object({
	id: z.string().optional().openapi({
		description: "This filter matches the exact id",
	}),
	idIn: z.array(z.string()).optional().openapi({
		description: "This filter matches the ids",
	}),
	fulltext: z.string().optional().openapi({
		description: "Runs fulltext on the collection/query.",
	}),
});

export type DefaultFilterSchema = typeof DefaultFilterSchema;

export namespace DefaultFilterSchema {
	export type Type = z.infer<DefaultFilterSchema>;
}

import { z } from "@hono/zod-openapi";

export const CleanupSchema = z.object({
	type: z.string().openapi({
		description: "Type of cleanup operation",
	}),
	total: z.number().openapi({
		description: "Total items scanned",
	}),
	deleted: z.number().openapi({
		description: "Number of items deleted",
	}),
});

export type CleanupSchema = typeof CleanupSchema;

export namespace CleanupSchema {
	export type Type = z.infer<typeof CleanupSchema>;
}

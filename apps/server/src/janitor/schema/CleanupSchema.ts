import { z } from "@hono/zod-openapi";

export const CleanupSchema = z
	.object({
		type: z.string().openapi({
			description: "Type of cleanup operation performed",
		}),
		total: z.number().openapi({
			description: "Total number of items processed during cleanup",
		}),
		deleted: z.number().openapi({
			description: "Number of items that were deleted",
		}),
	})
	.openapi("Cleanup", {
		description: "Results from a cleanup operation",
	});

export type CleanupSchema = typeof CleanupSchema;

export namespace CleanupSchema {
	export type Type = z.infer<CleanupSchema>;
}

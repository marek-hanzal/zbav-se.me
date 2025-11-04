import { z } from "@hono/zod-openapi";

export const CleanupDtoSchema = z
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
	.openapi("CleanupDto", {
		description: "Results from a cleanup operation",
	});

export type CleanupDtoSchema = typeof CleanupDtoSchema;

export namespace CleanupDtoSchema {
	export type Type = z.infer<CleanupDtoSchema>;
}

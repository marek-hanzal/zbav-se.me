import { z } from "zod";

export const CleanupSchema = z
	.object({
		type: z.string().meta({
			description: "Type of cleanup operation",
		}),
		total: z.number().meta({
			description: "Total items scanned",
		}),
		deleted: z.number().meta({
			description: "Number of items deleted",
		}),
	})
	.meta({
		id: "Cleanup",
		description: "Summary of a cleanup operation.",
	});

export type CleanupSchema = typeof CleanupSchema;

export namespace CleanupSchema {
	export type Type = z.infer<typeof CleanupSchema>;
}

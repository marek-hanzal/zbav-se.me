import { z } from "@hono/zod-openapi";

export const CursorSchema = z
	.object({
		page: z.number().gte(0).openapi({
			description: "Page number (0-indexed)",
		}),
		size: z.number().gte(1).lte(1000).openapi({
			description: "Page size",
		}),
	})
	.openapi("Cursor", {
		description: "Cursor for pagination",
	});

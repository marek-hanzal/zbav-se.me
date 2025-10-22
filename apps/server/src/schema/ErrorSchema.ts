import { z } from "@hono/zod-openapi";

export const ErrorSchema = z
	.object({
		message: z.string().openapi({
			description: "Error message describing what went wrong",
		}),
	})
	.openapi("Error", {
		description: "Standard error response format",
	});

export type ErrorSchema = typeof ErrorSchema;

export namespace ErrorSchema {
	export type Type = z.infer<typeof ErrorSchema>;
}

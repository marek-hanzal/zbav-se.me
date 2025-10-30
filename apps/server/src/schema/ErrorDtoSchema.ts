import { z } from "@hono/zod-openapi";

export const ErrorDtoSchema = z
	.object({
		message: z.string().openapi({
			description: "Error message describing what went wrong",
		}),
	})
	.openapi("ErrorDto", {
		description: "Standard error response format",
	});

export type ErrorDtoSchema = typeof ErrorDtoSchema;

export namespace ErrorDtoSchema {
	export type Type = z.infer<typeof ErrorDtoSchema>;
}

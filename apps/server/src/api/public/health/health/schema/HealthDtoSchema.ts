import { z } from "@hono/zod-openapi";

export const HealthDtoSchema = z
	.object({
		status: z.boolean(),
	})
	.openapi("HealthDto", {
		description: "Health check response",
	});

export type HealthDtoSchema = typeof HealthDtoSchema;

export namespace HealthDtoSchema {
	export type Type = z.infer<typeof HealthDtoSchema>;
}

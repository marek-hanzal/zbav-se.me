import { z } from "@hono/zod-openapi";

export const HealthSchema = z.object({
	status: z.boolean().openapi({
		description: "Health status",
	}),
});

export type HealthSchema = typeof HealthSchema;

export namespace HealthSchema {
	export type Type = z.infer<typeof HealthSchema>;
}

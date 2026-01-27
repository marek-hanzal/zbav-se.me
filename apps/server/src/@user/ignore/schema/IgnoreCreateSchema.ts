import { z } from "@hono/zod-openapi";

export const IgnoreCreateSchema = z
	.looseObject({
		listingId: z.string().openapi({
			description: "ID of the listing to ignore",
		}),
	})
	.strip()
	.openapi("IgnoreCreate", {
		description: "Data for creating an ignore entry",
	});

export type IgnoreCreateSchema = typeof IgnoreCreateSchema;

export namespace IgnoreCreateSchema {
	export type Type = z.infer<IgnoreCreateSchema>;
}

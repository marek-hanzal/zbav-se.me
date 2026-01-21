import { z } from "@hono/zod-openapi";

export const IgnoreItemSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the ignore",
		}),
	})
	.strip()
	.openapi("IgnoreItemSchema", {
		description: "Ignore collection item",
	});

export type IgnoreItemSchema = typeof IgnoreItemSchema;

export namespace IgnoreItemSchema {
	export type Type = z.infer<IgnoreItemSchema>;
}

import { z } from "@hono/zod-openapi";

export const FlagItemSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the flag",
		}),
	})
	.openapi("FlagItemSchema", {
		description: "Flag collection item",
	});

export type FlagItemSchema = typeof FlagItemSchema;

export namespace FlagItemSchema {
	export type Type = z.infer<FlagItemSchema>;
}

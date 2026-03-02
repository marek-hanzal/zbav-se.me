import { z } from "@hono/zod-openapi";

export const FlagItemSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the flag",
		}),
	})
	.strip()
	.openapi("FlagItem", {
		description: "Flag collection item",
	});

export type FlagItemSchema = typeof FlagItemSchema;

export namespace FlagItemSchema {
	export type Type = z.infer<FlagItemSchema>;
}

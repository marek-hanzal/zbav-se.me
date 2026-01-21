import { z } from "@hono/zod-openapi";

export const DraftItemSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the draft",
		}),
	})
	.strip()
	.openapi("DraftItemSchema", {
		description: "Draft collection item",
	});

export type DraftItemSchema = typeof DraftItemSchema;

export namespace DraftItemSchema {
	export type Type = z.infer<DraftItemSchema>;
}

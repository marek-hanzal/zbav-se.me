import { z } from "@hono/zod-openapi";

export const DraftItemSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the draft",
		}),
	})
	.openapi("DraftItemSchema", {
		description: "Draft collection item",
	});

export type DraftItemSchema = typeof DraftItemSchema;

export namespace DraftItemSchema {
	export type Type = z.infer<DraftItemSchema>;
}

import { z } from "@hono/zod-openapi";

export const ItemSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the item",
		}),
		//
		x: z.number().openapi({
			description: "X coordinate of the item",
		}),
		y: z.number().openapi({
			description: "Y coordinate of the item",
		}),
		//
		level: z.number().openapi({
			description: "Level of the item",
		}),
	})
	.strip()
	.openapi("Item", {
		description: "Item on the board",
	});

export type ItemSchema = typeof ItemSchema;

export namespace ItemSchema {
	export type Type = z.infer<ItemSchema>;
}

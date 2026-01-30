import { z } from "@hono/zod-openapi";

export const BoardItemItemSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the board item",
		}),
	})
	.strip()
	.openapi("BoardItemItem", {
		description: "Board item in collection",
	});

export type BoardItemItemSchema = typeof BoardItemItemSchema;

export namespace BoardItemItemSchema {
	export type Type = z.infer<BoardItemItemSchema>;
}

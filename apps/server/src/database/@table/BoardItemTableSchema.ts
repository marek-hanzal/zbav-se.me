import { z } from "@hono/zod-openapi";

export const BoardItemTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the board item",
	}),
	boardId: z.string().openapi({
		description: "ID of the board this item belongs to",
	}),
	x: z.number().openapi({
		description: "X coordinate of the item",
	}),
	y: z.number().openapi({
		description: "Y coordinate of the item",
	}),
	level: z.number().openapi({
		description: "Level of the item",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type BoardItemTableSchema = typeof BoardItemTableSchema;

export namespace BoardItemTableSchema {
	export type Type = z.infer<BoardItemTableSchema>;
}

import type { z } from "@hono/zod-openapi";
import { BoardItemTableSchema } from "~/database/@table/BoardItemTableSchema";

export const BoardItemItemSchema = BoardItemTableSchema.omit({
	boardId: true,
	createdAt: true,
})
	.strip()
	.openapi("BoardItemItem", {
		description: "Board item in collection",
	});

export type BoardItemItemSchema = typeof BoardItemItemSchema;

export namespace BoardItemItemSchema {
	export type Type = z.infer<BoardItemItemSchema>;
}

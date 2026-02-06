import { z } from "@hono/zod-openapi";
import { BoardItemTableSchema } from "~/database/@table/BoardItemTableSchema";

export const BoardItemSchema = z
	.looseObject({
		...BoardItemTableSchema.shape,
	})
	.strip()
	.openapi("BoardItem", {
		description: "Board item",
	});

export type BoardItemSchema = typeof BoardItemSchema;

export namespace BoardItemSchema {
	export type Type = z.infer<BoardItemSchema>;
}

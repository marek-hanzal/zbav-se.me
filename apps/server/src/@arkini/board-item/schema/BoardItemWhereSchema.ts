import { z } from "@hono/zod-openapi";
import { BoardItemFilterSchema } from "~/@arkini/board-item/schema/BoardItemFilterSchema";

export const BoardItemWhereSchema = z
	.object({
		...BoardItemFilterSchema.shape,
	})
	.openapi("BoardItemWhere", {
		description: "App-based filters for board item",
	});

export type BoardItemWhereSchema = typeof BoardItemWhereSchema;

export namespace BoardItemWhereSchema {
	export type Type = z.infer<BoardItemWhereSchema>;
}

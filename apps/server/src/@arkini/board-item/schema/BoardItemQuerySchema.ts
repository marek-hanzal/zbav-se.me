import { z } from "@hono/zod-openapi";
import { BoardItemFilterSchema } from "~/@arkini/board-item/schema/BoardItemFilterSchema";
import { BoardItemSortSchema } from "~/@arkini/board-item/schema/BoardItemSortSchema";
import { BoardItemWhereSchema } from "~/@arkini/board-item/schema/BoardItemWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const BoardItemQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: BoardItemFilterSchema.optional(),
		where: BoardItemWhereSchema.optional(),
		sort: BoardItemSortSchema.array().optional(),
	})
	.strip()
	.openapi("BoardItemQuery", {
		description: "Query object for board item collection",
	});

export type BoardItemQuerySchema = typeof BoardItemQuerySchema;

export namespace BoardItemQuerySchema {
	export type Type = z.infer<BoardItemQuerySchema>;
}

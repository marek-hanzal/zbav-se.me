import type { z } from "@hono/zod-openapi";
import { BoardItemTableSchema } from "~/database/@table/BoardItemTableSchema";

export const ItemSchema = BoardItemTableSchema.omit({
	boardId: true,
	createdAt: true,
})
	.strip()
	.openapi("Item", {
		description: "Item on the board",
	});

export type ItemSchema = typeof ItemSchema;

export namespace ItemSchema {
	export type Type = z.infer<ItemSchema>;
}

import { z } from "@hono/zod-openapi";
import { BoardItemQuerySchema } from "~/@arkini/board-item/schema/BoardItemQuerySchema";
import { BoardItemTableSchema } from "~/database/@table/BoardItemTableSchema";

export const BoardItemPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...BoardItemTableSchema.shape,
			})
			.omit({
				id: true,
				boardId: true,
				createdAt: true,
			})
			.partial()
			.strip()
			.openapi("BoardItemPatchData", {
				description: "Fields to update (all optional)",
			}),
		query: BoardItemQuerySchema,
	})
	.strip()
	.openapi("BoardItemPatch", {
		description: "Data for updating an existing board item",
	});

export type BoardItemPatchSchema = typeof BoardItemPatchSchema;

export namespace BoardItemPatchSchema {
	export type Type = z.infer<BoardItemPatchSchema>;
}

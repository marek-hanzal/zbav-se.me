import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const BoardItemSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
				"level",
				"x",
				"y",
			])
			.openapi("BoardItemSortField", {
				description: "Field for board item sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("BoardItemSort", {
		description: "Sort object for board item collection",
	});

export type BoardItemSortSchema = typeof BoardItemSortSchema;

export namespace BoardItemSortSchema {
	export type Type = z.infer<BoardItemSortSchema>;
}

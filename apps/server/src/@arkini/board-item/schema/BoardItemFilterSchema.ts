import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const BoardItemFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "Filter by board owner (scope)",
		}),
	})
	.openapi("BoardItemFilter", {
		description: "Board item collection filters",
	});

export type BoardItemFilterSchema = typeof BoardItemFilterSchema;

export namespace BoardItemFilterSchema {
	export type Type = z.infer<BoardItemFilterSchema>;
}

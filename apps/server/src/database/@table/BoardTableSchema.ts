import { z } from "@hono/zod-openapi";

export const BoardTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the board",
	}),
	userId: z.string().openapi({
		description: "ID of the user who owns the board",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type BoardTableSchema = typeof BoardTableSchema;

export namespace BoardTableSchema {
	export type Type = z.infer<BoardTableSchema>;
}

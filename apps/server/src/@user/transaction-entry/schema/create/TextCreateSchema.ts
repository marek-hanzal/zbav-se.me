import { z } from "@hono/zod-openapi";
import { BaseCreateSchema } from "./BaseCreateSchema";

export const TextCreateSchema = z
	.looseObject({
		...BaseCreateSchema.shape,
		kind: z.literal("text"),
		payload: z.looseObject({
			text: z.string().openapi({
				description: "Text entry body",
			}),
		}),
	})
	.openapi("TransactionEntryTextCreate");

export type TextCreateSchema = typeof TextCreateSchema;

export namespace TextCreateSchema {
	export type Type = z.infer<TextCreateSchema>;
}

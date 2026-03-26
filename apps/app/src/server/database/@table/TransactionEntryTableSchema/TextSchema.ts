import { z } from "@hono/zod-openapi";
import { TransactionEntryKindEnumSchema } from "~/server/database/@enum/TransactionEntryKindEnumSchema";
import { EntrySchema } from "./EntrySchema";

export const TextSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: TransactionEntryKindEnumSchema.extract([
			"text",
		]),
		payload: z
			.looseObject({
				text: z.string().openapi({
					description: "Text entry body",
				}),
			})
			.strip(),
	})
	.strip();

export type TextSchema = typeof TextSchema;

export namespace TextSchema {
	export type Type = z.infer<TextSchema>;
}

import { z } from "zod";
import { TransactionEntryKindEnumSchema } from "~/transaction-contract/schema/TransactionEntryKindEnumSchema";
import { EntrySchema } from "~/user-transaction-entry/schema/TransactionEntryCreateEntrySchema";

export const TextSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: TransactionEntryKindEnumSchema.extract([
			"text",
		]),
		payload: z
			.looseObject({
				text: z.string().meta({
					description: "Text entry body",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "TransactionEntryTextCreate",
	});

export type TextSchema = typeof TextSchema;

export namespace TextSchema {
	export type Type = z.infer<TextSchema>;
}

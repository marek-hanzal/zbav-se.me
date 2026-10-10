import { z } from "zod";
import { EntrySchema } from "~/database/schema/TransactionEntryTableEntrySchema";
import { TransactionEntryKindEnumSchema } from "~/transaction-contract/schema/TransactionEntryKindEnumSchema";

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
		id: "TransactionEntryText",
		description: "Transaction entry text payload",
	});

export type TextSchema = typeof TextSchema;

export namespace TextSchema {
	export type Type = z.infer<TextSchema>;
}

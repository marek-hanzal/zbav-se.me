import { z } from "zod";

export const EntrySchema = z
	.looseObject({
		id: z.string().meta({
			description: "Transaction entry identifier",
		}),
		transactionId: z.string().meta({
			description: "Transaction identifier",
		}),
		userId: z.string().nullable().meta({
			description: "Author/actor user identifier",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.strip()
	.meta({
		id: "TransactionEntry",
		description: "Transaction entry table row",
	});

export type EntrySchema = typeof EntrySchema;

export namespace EntrySchema {
	export type Type = z.infer<EntrySchema>;
}

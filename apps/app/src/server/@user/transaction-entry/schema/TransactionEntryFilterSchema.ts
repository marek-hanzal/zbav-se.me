import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";
import { TransactionEntryKindEnumSchema } from "~/server/database/@enum/TransactionEntryKindEnumSchema";

export const TransactionEntryFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
		transactionId: z.string().optional().openapi({
			description: "Matches a concrete transaction identifier",
		}),
		userId: z.string().optional().openapi({
			description: "Matches a concrete actor identifier",
		}),
		kind: TransactionEntryKindEnumSchema.optional(),
		kindIn: z.array(TransactionEntryKindEnumSchema).optional().openapi({
			description: "Matches any of the provided transaction entry kinds",
		}),
	})
	.openapi("TransactionEntryFilter", {
		description: "Transaction entry collection filters",
	});

export type TransactionEntryFilterSchema = typeof TransactionEntryFilterSchema;

export namespace TransactionEntryFilterSchema {
	export type Type = z.infer<TransactionEntryFilterSchema>;
}

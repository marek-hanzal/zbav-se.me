import { z } from "@hono/zod-openapi";
import { TransactionEntryPayloadSchema } from "~/@user/transaction-entry/schema/payload/TransactionEntryPayloadSchema";
import { TransactionEntryPayloadValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryPayloadValueSchema";
import { TransactionEntryKindEnumSchema } from "~/database/@enum/TransactionEntryKindEnumSchema";
import type { RefinementCtx } from "zod/v4";

export const TransactionEntryTableSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "Transaction entry identifier",
		}),
		transactionId: z.string().openapi({
			description: "Transaction identifier",
		}),
		userId: z.string().nullable().openapi({
			description: "Author/actor user identifier",
		}),
		createdAt: z.coerce.date().openapi({
			description: "Creation timestamp",
			type: "string",
		}),
		kind: TransactionEntryKindEnumSchema,
		payload: TransactionEntryPayloadValueSchema,
	})
	.superRefine((value, ctx: RefinementCtx) => {
		const result = TransactionEntryPayloadSchema.safeParse({
			kind: value.kind,
			payload: value.payload,
		});

		if (result.success) {
			return;
		}

		for (const issue of result.error.issues) {
			ctx.addIssue({
				code: "custom",
				message: issue.message,
				path: issue.path,
			});
		}
	})
	.openapi("TransactionEntry", {
		description: "Transaction timeline entry",
	});

export type TransactionEntryTableSchema = typeof TransactionEntryTableSchema;

export namespace TransactionEntryTableSchema {
	export type Type = z.infer<TransactionEntryTableSchema>;
}

import { z } from "@hono/zod-openapi";
import { TransactionEntryPackageValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryPackageValueSchema";

export const TransactionEntryPackageCreateSchema = z
	.looseObject({
		transactionId: z.string().openapi({
			description: "Transaction identifier",
		}),
		kind: z.literal("package"),
		payload: TransactionEntryPackageValueSchema,
	})
	.openapi("TransactionEntryPackageCreate");

export type TransactionEntryPackageCreateSchema = typeof TransactionEntryPackageCreateSchema;

export namespace TransactionEntryPackageCreateSchema {
	export type Type = z.infer<TransactionEntryPackageCreateSchema>;
}

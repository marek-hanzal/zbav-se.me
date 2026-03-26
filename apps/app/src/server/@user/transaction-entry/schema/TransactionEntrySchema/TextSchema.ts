import { z } from "@hono/zod-openapi";
import { TransactionEntryDirectionEnumSchema } from "~/server/@user/transaction-entry/schema/TransactionEntryDirectionEnumSchema";
import { TextSchema as BaseTextSchema } from "~/server/database/@table/TransactionEntryTableSchema/TextSchema";

export const TransactionEntryText = z
	.looseObject({
		...BaseTextSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
	})
	.strip()
	.openapi("TransactionEntryText", {
		description: "Transaction text entry with user-authored message payload",
	});

export type TransactionEntryText = typeof TransactionEntryText;

export namespace TransactionEntryText {
	export type Type = z.infer<TransactionEntryText>;
}

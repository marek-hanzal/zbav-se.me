import { z } from "zod";
import { TransactionEntryDirectionEnumSchema } from "~/server/@user/transaction-entry/schema/TransactionEntryDirectionEnumSchema";
import { CommonSchema as BaseCommonSchema } from "~/server/database/@table/TransactionEntryTableSchema/CommonSchema";

export const TransactionEntryCommon = z
	.looseObject({
		...BaseCommonSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
	})
	.strip()
	.meta({
		id: "TransactionEntryCommon",
		description: "Transaction system entry with shared status or informational payload",
	});

export type TransactionEntryCommon = typeof TransactionEntryCommon;

export namespace TransactionEntryCommon {
	export type Type = z.infer<TransactionEntryCommon>;
}

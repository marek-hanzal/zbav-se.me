import { z } from "@hono/zod-openapi";
import { TransactionEntryDirectionEnumSchema } from "~/server/@user/transaction-entry/schema/TransactionEntryDirectionEnumSchema";
import { CommonSchema as BaseCommonSchema } from "~/server/database/@table/TransactionEntryTableSchema/CommonSchema";

export const TransactionEntryCommon = z
	.looseObject({
		...BaseCommonSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
	})
	.strip()
	.openapi("TransactionEntryCommon", {
		description: "Transaction system entry with shared status or informational payload",
	});

export type TransactionEntryCommon = typeof TransactionEntryCommon;

export namespace TransactionEntryCommon {
	export type Type = z.infer<TransactionEntryCommon>;
}

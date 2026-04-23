import { z } from "zod";
import { CommonSchema as BaseCommonSchema } from "~/server/database/@table/TransactionEntryTableSchema/CommonSchema";
import { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";

export const TransactionEntryCommon = z
	.looseObject({
		...BaseCommonSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
		listingId: z.string().meta({
			description: "Listing this entry belongs to",
		}),
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

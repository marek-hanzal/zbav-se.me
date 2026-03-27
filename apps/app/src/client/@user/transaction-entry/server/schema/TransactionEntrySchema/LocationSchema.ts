import { z } from "zod";
import { TransactionEntryDirectionEnumSchema } from "~/client/@user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import { LocationSchema as BaseLocationSchema } from "~/server/database/@table/TransactionEntryTableSchema/LocationSchema";

export const TransactionEntryLocation = z
	.looseObject({
		...BaseLocationSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
	})
	.strip()
	.meta({
		id: "TransactionEntryLocation",
		description: "Transaction location entry with linked location payload",
	});

export type TransactionEntryLocation = typeof TransactionEntryLocation;

export namespace TransactionEntryLocation {
	export type Type = z.infer<TransactionEntryLocation>;
}

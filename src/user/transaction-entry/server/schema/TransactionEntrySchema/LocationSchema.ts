import { z } from "zod";
import { LocationSchema as BaseLocationSchema } from "~/server/database/@table/TransactionEntryTableSchema/LocationSchema";
import { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";

export const TransactionEntryLocation = z
	.looseObject({
		...BaseLocationSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
		listingId: z.string().meta({
			description: "Listing this entry belongs to",
		}),
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

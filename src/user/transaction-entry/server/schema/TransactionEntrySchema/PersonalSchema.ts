import { z } from "zod";
import { PersonalSchema as BasePersonalSchema } from "~/server/database/@table/TransactionEntryTableSchema/PersonalSchema";
import { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";

export const TransactionEntryPersonal = z
	.looseObject({
		...BasePersonalSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
		listingId: z.string().meta({
			description: "Listing this entry belongs to",
		}),
	})
	.strip()
	.meta({
		id: "TransactionEntryPersonal",
		description: "Transaction personal entry with contact and handoff payload",
	});

export type TransactionEntryPersonal = typeof TransactionEntryPersonal;

export namespace TransactionEntryPersonal {
	export type Type = z.infer<TransactionEntryPersonal>;
}

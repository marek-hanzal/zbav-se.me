import { z } from "zod";
import { TransactionEntryDirectionEnumSchema } from "~/client/@user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import { PersonalSchema as BasePersonalSchema } from "~/server/database/@table/TransactionEntryTableSchema/PersonalSchema";

export const TransactionEntryPersonal = z
	.looseObject({
		...BasePersonalSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
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

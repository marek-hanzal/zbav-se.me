import { z } from "@hono/zod-openapi";
import { TransactionEntryDirectionEnumSchema } from "~/server/@user/transaction-entry/schema/TransactionEntryDirectionEnumSchema";
import { PersonalSchema as BasePersonalSchema } from "~/server/database/@table/TransactionEntryTableSchema/PersonalSchema";

export const TransactionEntryPersonal = z
	.looseObject({
		...BasePersonalSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
	})
	.strip()
	.openapi("TransactionEntryPersonal", {
		description: "Transaction personal entry with contact and handoff payload",
	});

export type TransactionEntryPersonal = typeof TransactionEntryPersonal;

export namespace TransactionEntryPersonal {
	export type Type = z.infer<TransactionEntryPersonal>;
}

import { z } from "@hono/zod-openapi";
import { TransactionEntryDirectionEnumSchema } from "~/@user/transaction-entry/schema/TransactionEntryDirectionEnumSchema";
import { TransactionEntryTableSchema } from "~/database/@table/TransactionEntryTableSchema";

export const TransactionEntrySchema = TransactionEntryTableSchema.and(
	z
		.looseObject({
			direction: TransactionEntryDirectionEnumSchema.openapi({
				description: "Direction of the entry relative to the current user",
			}),
		})
		.strip(),
);

export type TransactionEntrySchema = typeof TransactionEntrySchema;

export namespace TransactionEntrySchema {
	export type Type = z.infer<TransactionEntrySchema>;
}

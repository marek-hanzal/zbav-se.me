import { z } from "@hono/zod-openapi";
import { TransactionEntryDirectionEnumSchema } from "~/@user/transaction-entry/schema/TransactionEntryDirectionEnumSchema";
import { EntrySchema as DatabaseEntrySchema } from "~/database/@table/TransactionEntryTableSchema/EntrySchema";

export const EntrySchema = z
	.looseObject({
		...DatabaseEntrySchema.shape,
		direction: TransactionEntryDirectionEnumSchema.openapi({
			description: "Direction of the entry relative to the current user",
		}),
	})
	.strip();

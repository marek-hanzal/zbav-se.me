import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/common/user-transaction/enum/TransactionSideEnumSchema";

export const TransactionUserTableSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the transaction user entry",
		}),
		transactionId: z.string().openapi({
			description: "ID of the parent transaction",
		}),
		userId: z.string().openapi({
			description: "ID of the participant user",
		}),
		side: TransactionSideEnumSchema.openapi({
			description: "Participant side within the transaction",
		}),
		createdAt: z.coerce.date().openapi({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.strip();

export type TransactionUserTableSchema = typeof TransactionUserTableSchema;

export namespace TransactionUserTableSchema {
	export type Type = z.infer<TransactionUserTableSchema>;
}

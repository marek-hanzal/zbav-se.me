import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/app/transaction/schema/TransactionSideEnumSchema";
import { TransactionStatusEnumSchema } from "~/app/transaction/schema/TransactionStatusEnumSchema";

export const TransactionPatchSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the transaction to patch",
		}),
		status: TransactionStatusEnumSchema.optional(),
		side: TransactionSideEnumSchema.optional(),
	})
	.refine((value) => Boolean(value.status ?? value.side), {
		message: "Provide at least side or status to patch",
		path: [
			"status",
		],
	})
	.openapi("TransactionPatch", {
		description: "Payload for patching a transaction",
	});

export type TransactionPatchSchema = typeof TransactionPatchSchema;

export namespace TransactionPatchSchema {
	export type Type = z.infer<TransactionPatchSchema>;
}

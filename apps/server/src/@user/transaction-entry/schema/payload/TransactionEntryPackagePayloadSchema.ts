import { z } from "@hono/zod-openapi";
import { TransactionEntryPackageValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryPackageValueSchema";

export const TransactionEntryPackagePayloadSchema = z
	.looseObject({
		kind: z.literal("package"),
		payload: TransactionEntryPackageValueSchema,
	})
	.openapi("TransactionEntryPackagePayload");

export type TransactionEntryPackagePayloadSchema = typeof TransactionEntryPackagePayloadSchema;

export namespace TransactionEntryPackagePayloadSchema {
	export type Type = z.infer<TransactionEntryPackagePayloadSchema>;
}

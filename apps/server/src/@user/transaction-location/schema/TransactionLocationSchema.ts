import { z } from "@hono/zod-openapi";
import type { TransactionEventEnumSchema } from "~/app/transaction/schema/ListingTransactionEventEnumSchema";
import { TransactionLocationDbSchema } from "~/app/transaction-location/schema/ListingTransactionLocationDbSchema";

export const TransactionLocationSchema = z
	.object({
		...TransactionLocationDbSchema.shape,
		event: z.literal("location" satisfies TransactionEventEnumSchema.Type).openapi({
			description: "Event type",
		}),
	})
	.openapi("TransactionLocation", {
		description: "Listing transaction location entry",
	});

export type TransactionLocationSchema = typeof TransactionLocationSchema;

export namespace TransactionLocationSchema {
	export type Type = z.infer<TransactionLocationSchema>;
}

import { z } from "@hono/zod-openapi";
import type { ListingTransactionEventEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionEventEnumSchema";
import { ListingTransactionStatusDbSchema } from "~/app/listing-transaction-status/schema/ListingTransactionStatusDbSchema";

export const ListingTransactionStatusSchema = z
	.object({
		...ListingTransactionStatusDbSchema.shape,
		event: z.literal("status" satisfies ListingTransactionEventEnumSchema.Type).openapi({
			description: "Event type",
		}),
	})
	.omit({
		createdAt: true,
	})
	.openapi("ListingTransactionStatus", {
		description: "Listing transaction status entry",
	});

export type ListingTransactionStatusSchema = typeof ListingTransactionStatusSchema;

export namespace ListingTransactionStatusSchema {
	export type Type = z.infer<ListingTransactionStatusSchema>;
}

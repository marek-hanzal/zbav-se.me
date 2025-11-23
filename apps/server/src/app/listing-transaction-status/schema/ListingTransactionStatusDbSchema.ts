import { z } from "@hono/zod-openapi";
import type { ListingTransactionEventEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionEventEnumSchema";
import { ListingTransactionSideEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionSideEnumSchema";
import { ListingTransactionStatusEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionStatusEnumSchema";

export const ListingTransactionStatusDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction status entry",
	}),
	listingTransactionId: z.string().openapi({
		description: "ID of the transaction referenced by the status",
	}),
	event: z.literal("status" satisfies ListingTransactionEventEnumSchema.Type).openapi({
		description: "Type of transaction event (must be 'status')",
	}),
	side: ListingTransactionSideEnumSchema,
	status: ListingTransactionStatusEnumSchema,
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type ListingTransactionStatusDbSchema = typeof ListingTransactionStatusDbSchema;

export namespace ListingTransactionStatusDbSchema {
	export type Type = z.infer<ListingTransactionStatusDbSchema>;
}

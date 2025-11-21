import { z } from "@hono/zod-openapi";
import { ListingTransactionEventSchema } from "~/app/listing-transaction/schema/ListingTransactionEventSchema";
import { ListingTransactionSideSchema } from "~/app/listing-transaction/schema/ListingTransactionSideSchema";
import { ListingTransactionStatusSchema } from "~/app/listing-transaction/schema/ListingTransactionStatusSchema";

export const ListingTransactionStatusDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction status entry",
	}),
	listingTransactionId: z.string().openapi({
		description: "ID of the transaction referenced by the status",
	}),
	event: ListingTransactionEventSchema,
	side: ListingTransactionSideSchema,
	status: ListingTransactionStatusSchema,
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type ListingTransactionStatusDbSchema = typeof ListingTransactionStatusDbSchema;

export namespace ListingTransactionStatusDbSchema {
	export type Type = z.infer<ListingTransactionStatusDbSchema>;
}

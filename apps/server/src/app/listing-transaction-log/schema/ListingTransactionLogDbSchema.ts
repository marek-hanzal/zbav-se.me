import { z } from "@hono/zod-openapi";
import { ListingTransactionSideSchema } from "../../listing-transaction/schema/ListingTransactionSideSchema";
import { ListingTransactionStatusSchema } from "../../listing-transaction/schema/ListingTransactionStatusSchema";

export const ListingTransactionLogDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction log entry",
	}),
	listingTransactionId: z.string().openapi({
		description: "ID of the transaction referenced by the log",
	}),
	status: ListingTransactionStatusSchema,
	side: ListingTransactionSideSchema,
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type ListingTransactionLogDbSchema = typeof ListingTransactionLogDbSchema;

export namespace ListingTransactionLogDbSchema {
	export type Type = z.infer<ListingTransactionLogDbSchema>;
}

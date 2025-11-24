import { z } from "@hono/zod-openapi";
import { ListingTransactionStatusDbSchema } from "~/app/listing-transaction-status/schema/ListingTransactionStatusDbSchema";

export const ListingTransactionStatusSchema = z
	.object({
		...ListingTransactionStatusDbSchema.shape,
	})
	.openapi("ListingTransactionStatus", {
		description: "Listing transaction status entry",
	})
	.omit({
		createdAt: true,
	});

export type ListingTransactionStatusSchema = typeof ListingTransactionStatusSchema;

export namespace ListingTransactionStatusSchema {
	export type Type = z.infer<ListingTransactionStatusSchema>;
}

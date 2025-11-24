import { z } from "@hono/zod-openapi";
import { ListingTransactionMessageDbSchema } from "~/app/listing-transaction-message/schema/ListingTransactionMessageDbSchema";

export const ListingTransactionMessageSchema = z
	.object({
		...ListingTransactionMessageDbSchema.shape,
	})
	.openapi("ListingTransactionMessage", {
		description: "Listing transaction message entry",
	})
	.omit({
		createdAt: true,
	});

export type ListingTransactionMessageSchema = typeof ListingTransactionMessageSchema;

export namespace ListingTransactionMessageSchema {
	export type Type = z.infer<ListingTransactionMessageSchema>;
}

import { z } from "@hono/zod-openapi";
import { ListingTransactionLogDbSchema } from "~/app/listing-transaction-log/schema/ListingTransactionLogDbSchema";

export const ListingTransactionLogSchema = z
	.object({
		...ListingTransactionLogDbSchema.shape,
	})
	.openapi("ListingTransactionLog", {
		description: "Listing transaction log entry",
	});

export type ListingTransactionLogSchema = typeof ListingTransactionLogSchema;

export namespace ListingTransactionLogSchema {
	export type Type = z.infer<ListingTransactionLogSchema>;
}

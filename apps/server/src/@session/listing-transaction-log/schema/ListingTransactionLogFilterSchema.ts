import { z } from "@hono/zod-openapi";
import { ListingTransactionSideSchema } from "../../../app/listing-transaction/schema/ListingTransactionSideSchema";
import { ListingTransactionStatusSchema } from "../../../app/listing-transaction/schema/ListingTransactionStatusSchema";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";

export const ListingTransactionLogFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		listingTransactionId: z.string().optional().openapi({
			description: "This filter matches the exact listingTransactionId",
		}),
		status: ListingTransactionStatusSchema.optional(),
		statusIn: ListingTransactionStatusSchema.array().optional(),
		side: ListingTransactionSideSchema.optional(),
	})
	.openapi("ListingTransactionLogFilter", {
		description: "Filter object for listing transaction log collection",
	});

export type ListingTransactionLogFilterSchema = typeof ListingTransactionLogFilterSchema;

export namespace ListingTransactionLogFilterSchema {
	export type Type = z.infer<ListingTransactionLogFilterSchema>;
}

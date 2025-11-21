import { z } from "@hono/zod-openapi";
import { ListingTransactionSideSchema } from "~/app/listing-transaction/schema/ListingTransactionSideSchema";
import { ListingTransactionStatusSchema as ListingTransactionStatusEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionStatusSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const ListingTransactionStatusFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		listingTransactionId: z.string().optional().openapi({
			description: "This filter matches the exact listingTransactionId",
		}),
		status: ListingTransactionStatusEnumSchema.optional(),
		statusIn: ListingTransactionStatusEnumSchema.array().optional(),
		side: ListingTransactionSideSchema.optional(),
	})
	.openapi("ListingTransactionStatusFilter", {
		description: "Filter object for listing transaction status",
	});

export type ListingTransactionStatusFilterSchema = typeof ListingTransactionStatusFilterSchema;

export namespace ListingTransactionStatusFilterSchema {
	export type Type = z.infer<ListingTransactionStatusFilterSchema>;
}

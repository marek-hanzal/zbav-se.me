import { z } from "@hono/zod-openapi";
import { ListingTransactionSideSchema } from "../../../app/listing-transaction/schema/ListingTransactionSideSchema";
import { ListingTransactionStatusSchema } from "../../../app/listing-transaction/schema/ListingTransactionStatusSchema";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";

export const ListingTransactionFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().openapi({
			description: "This filter matches the exact listingId",
		}),
		status: ListingTransactionStatusSchema.optional(),
		side: ListingTransactionSideSchema.optional(),
	})
	.openapi("ListingTransactionFilter", {
		description: "Filter object for listing transaction collection",
	});

export type ListingTransactionFilterSchema = typeof ListingTransactionFilterSchema;

export namespace ListingTransactionFilterSchema {
	export type Type = z.infer<ListingTransactionFilterSchema>;
}

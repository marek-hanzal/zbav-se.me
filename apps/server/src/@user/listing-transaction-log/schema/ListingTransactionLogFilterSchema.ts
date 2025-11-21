import { z } from "@hono/zod-openapi";
import { ListingTransactionEventSchema } from "~/app/listing-transaction/schema/ListingTransactionEventSchema";
import { ListingTransactionSideSchema } from "~/app/listing-transaction/schema/ListingTransactionSideSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const ListingTransactionLogFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		listingTransactionId: z.string().optional().openapi({
			description: "This filter matches the exact listingTransactionId",
		}),
		event: ListingTransactionEventSchema.optional(),
		eventIn: ListingTransactionEventSchema.array().optional(),
		side: ListingTransactionSideSchema.optional(),
		userId: z.string().optional(),
	})
	.openapi("ListingTransactionLogFilter", {
		description: "Filter object for listing transaction log collection",
	});

export type ListingTransactionLogFilterSchema = typeof ListingTransactionLogFilterSchema;

export namespace ListingTransactionLogFilterSchema {
	export type Type = z.infer<ListingTransactionLogFilterSchema>;
}

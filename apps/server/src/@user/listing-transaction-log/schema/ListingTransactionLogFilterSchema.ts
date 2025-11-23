import { z } from "@hono/zod-openapi";
import { ListingTransactionEventEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionEventEnumSchema";
import { ListingTransactionSideEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionSideEnumSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const ListingTransactionLogFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		listingTransactionId: z.string().optional().openapi({
			description: "This filter matches the exact listingTransactionId",
		}),
		event: ListingTransactionEventEnumSchema.optional(),
		eventIn: ListingTransactionEventEnumSchema.array().optional(),
		side: ListingTransactionSideEnumSchema.optional(),
		userId: z.string().optional(),
	})
	.openapi("ListingTransactionLogFilter", {
		description: "Filter object for listing transaction log collection",
	});

export type ListingTransactionLogFilterSchema = typeof ListingTransactionLogFilterSchema;

export namespace ListingTransactionLogFilterSchema {
	export type Type = z.infer<ListingTransactionLogFilterSchema>;
}

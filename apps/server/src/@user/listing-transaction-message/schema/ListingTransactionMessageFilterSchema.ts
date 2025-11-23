import { z } from "@hono/zod-openapi";
import { ListingTransactionSideEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionSideEnumSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const ListingTransactionMessageFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		listingTransactionId: z.string().optional().openapi({
			description: "This filter matches the exact listingTransactionId",
		}),
		side: ListingTransactionSideEnumSchema.optional(),
	})
	.openapi("ListingTransactionMessageFilter", {
		description: "Filter object for listing transaction message",
	});

export type ListingTransactionMessageFilterSchema = typeof ListingTransactionMessageFilterSchema;

export namespace ListingTransactionMessageFilterSchema {
	export type Type = z.infer<ListingTransactionMessageFilterSchema>;
}

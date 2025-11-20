import { z } from "@hono/zod-openapi";
import { ListingTransactionDbSchema } from "../../../app/listing-transaction/schema/ListingTransactionDbSchema";

export const ListingTransactionSchema = z
	.object({
		...ListingTransactionDbSchema.shape,
		title: z.string().openapi({
			description: "Listing transaction title",
		}),
	})
	.omit({
		userId: true,
	})
	.openapi("ListingTransaction", {
		description: "Listing transaction data",
	});

export type ListingTransactionSchema = typeof ListingTransactionSchema;

export namespace ListingTransactionSchema {
	export type Type = z.infer<ListingTransactionSchema>;
}

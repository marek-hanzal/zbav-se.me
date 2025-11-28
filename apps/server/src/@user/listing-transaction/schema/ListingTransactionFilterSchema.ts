import { z } from "@hono/zod-openapi";
import { ListingTransactionStatusEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionStatusEnumSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const ListingTransactionFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().openapi({
			description: "This filter matches the exact listingId",
		}),
		status: ListingTransactionStatusEnumSchema.optional().openapi({
			description: "This filter matches the current status of the listing transaction",
		}),
		statusIn: z.array(ListingTransactionStatusEnumSchema).optional().openapi({
			description:
				"This filter matches any of the provided statuses for the current status of the listing transaction",
		}),
	})
	.openapi("ListingTransactionFilter", {
		description: "Filter object for listing transaction collection",
	});

export type ListingTransactionFilterSchema = typeof ListingTransactionFilterSchema;

export namespace ListingTransactionFilterSchema {
	export type Type = z.infer<ListingTransactionFilterSchema>;
}

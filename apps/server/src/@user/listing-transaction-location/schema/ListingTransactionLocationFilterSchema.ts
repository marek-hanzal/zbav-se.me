import { z } from "@hono/zod-openapi";
import { ListingTransactionSideSchema } from "~/app/listing-transaction/schema/ListingTransactionSideSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const ListingTransactionLocationFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		listingTransactionId: z.string().optional().openapi({
			description: "This filter matches the exact listingTransactionId",
		}),
		locationId: z.string().optional().openapi({
			description: "This filter matches the exact locationId",
		}),
		side: ListingTransactionSideSchema.optional(),
	})
	.openapi("ListingTransactionLocationFilter", {
		description: "Filter object for listing transaction location",
	});

export type ListingTransactionLocationFilterSchema = typeof ListingTransactionLocationFilterSchema;

export namespace ListingTransactionLocationFilterSchema {
	export type Type = z.infer<ListingTransactionLocationFilterSchema>;
}

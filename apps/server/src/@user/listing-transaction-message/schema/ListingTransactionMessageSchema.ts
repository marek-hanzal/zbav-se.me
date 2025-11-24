import { z } from "@hono/zod-openapi";
import type { ListingTransactionEventEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionEventEnumSchema";
import { ListingTransactionMessageDbSchema } from "~/app/listing-transaction-message/schema/ListingTransactionMessageDbSchema";

export const ListingTransactionMessageSchema = z
	.object({
		...ListingTransactionMessageDbSchema.shape,
		event: z.literal("message" satisfies ListingTransactionEventEnumSchema.Type).openapi({
			description: "Event type",
		}),
	})
	.openapi("ListingTransactionMessage", {
		description: "Listing transaction message entry",
	});

export type ListingTransactionMessageSchema = typeof ListingTransactionMessageSchema;

export namespace ListingTransactionMessageSchema {
	export type Type = z.infer<ListingTransactionMessageSchema>;
}

import { z } from "@hono/zod-openapi";
import type { ListingTransactionEventEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionEventEnumSchema";
import { ListingTransactionSideEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionSideEnumSchema";

export const ListingTransactionMessageDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction message entry",
	}),
	listingTransactionId: z.string().openapi({
		description: "ID of the transaction referenced by the message",
	}),
	event: z.literal("message" satisfies ListingTransactionEventEnumSchema.Type).openapi({
		description: "Type of transaction event (must be 'message')",
	}),
	side: ListingTransactionSideEnumSchema,
	message: z.string().openapi({
		description: "Message content",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type ListingTransactionMessageDbSchema = typeof ListingTransactionMessageDbSchema;

export namespace ListingTransactionMessageDbSchema {
	export type Type = z.infer<ListingTransactionMessageDbSchema>;
}

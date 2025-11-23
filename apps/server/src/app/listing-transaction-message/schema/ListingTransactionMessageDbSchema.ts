import { z } from "@hono/zod-openapi";
import type { ListingTransactionEventSchema } from "~/app/listing-transaction/schema/ListingTransactionEventSchema";
import { ListingTransactionSideSchema } from "~/app/listing-transaction/schema/ListingTransactionSideSchema";

export const ListingTransactionMessageDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction message entry",
	}),
	listingTransactionId: z.string().openapi({
		description: "ID of the transaction referenced by the message",
	}),
	event: z.literal("message" satisfies ListingTransactionEventSchema.Type).openapi({
		description: "Type of transaction event (must be 'message')",
	}),
	side: ListingTransactionSideSchema,
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

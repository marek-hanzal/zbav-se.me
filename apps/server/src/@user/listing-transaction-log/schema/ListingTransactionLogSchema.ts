import { z } from "@hono/zod-openapi";
import { ListingTransactionEventSchema } from "~/app/listing-transaction/schema/ListingTransactionEventSchema";
import { ListingTransactionSideSchema } from "~/app/listing-transaction/schema/ListingTransactionSideSchema";
import { ListingTransactionStatusSchema } from "~/app/listing-transaction/schema/ListingTransactionStatusSchema";

export const ListingTransactionLogSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the transaction log entry",
		}),
		listingTransactionId: z.string().openapi({
			description: "ID of the transaction referenced by the log",
		}),
		event: ListingTransactionEventSchema,
		side: ListingTransactionSideSchema,
		status: ListingTransactionStatusSchema.optional().openapi({
			description: "Status (only for status events)",
		}),
		//
		payload: z.any().optional().openapi({
			description: "Payload of the event",
		}),
		//
		createdAt: z.coerce.date().openapi({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.openapi("ListingTransactionLog", {
		description: "Listing transaction log entry (unified view across all event types)",
	});

export type ListingTransactionLogSchema = typeof ListingTransactionLogSchema;

export namespace ListingTransactionLogSchema {
	export type Type = z.infer<ListingTransactionLogSchema>;
}

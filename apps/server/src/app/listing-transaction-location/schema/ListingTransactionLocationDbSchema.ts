import { z } from "@hono/zod-openapi";
import { ListingTransactionEventSchema } from "~/app/listing-transaction/schema/ListingTransactionEventSchema";
import { ListingTransactionSideSchema } from "~/app/listing-transaction/schema/ListingTransactionSideSchema";

export const ListingTransactionLocationDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction location entry",
	}),
	listingTransactionId: z.string().openapi({
		description: "ID of the transaction referenced by the location",
	}),
	event: ListingTransactionEventSchema,
	side: ListingTransactionSideSchema,
	locationId: z.string().openapi({
		description: "ID of the location",
	}),
	time: z.coerce.date().openapi({
		description: "Scheduled time for the location",
		type: "string",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type ListingTransactionLocationDbSchema = typeof ListingTransactionLocationDbSchema;

export namespace ListingTransactionLocationDbSchema {
	export type Type = z.infer<ListingTransactionLocationDbSchema>;
}

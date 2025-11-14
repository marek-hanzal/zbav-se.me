import { z } from "@hono/zod-openapi";
import { ListingTransactionSideSchema } from "./ListingTransactionSideSchema";
import { ListingTransactionStatusSchema } from "./ListingTransactionStatusSchema";

export const ListingTransactionDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction",
	}),
	userId: z.string().openapi({
		description: "ID of the user participating in the transaction",
	}),
	listingId: z.string().openapi({
		description: "ID of the related listing",
	}),
	status: ListingTransactionStatusSchema,
	side: ListingTransactionSideSchema,
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
	updatedAt: z.coerce.date().openapi({
		description: "Last update timestamp",
		type: "string",
	}),
	expiresAt: z.coerce.date().openapi({
		description: "Expiration timestamp",
		type: "string",
	}),
});

export type ListingTransactionDbSchema = typeof ListingTransactionDbSchema;

export namespace ListingTransactionDbSchema {
	export type Type = z.infer<ListingTransactionDbSchema>;
}

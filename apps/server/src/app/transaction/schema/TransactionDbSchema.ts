import { z } from "@hono/zod-openapi";

export const TransactionDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction",
	}),
	userId: z.string().openapi({
		description: "ID of the user participating in the transaction",
	}),
	listingId: z.string().openapi({
		description: "ID of the related listing",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the message thread associated with the transaction",
	}),
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

export type TransactionDbSchema = typeof TransactionDbSchema;

export namespace TransactionDbSchema {
	export type Type = z.infer<TransactionDbSchema>;
}

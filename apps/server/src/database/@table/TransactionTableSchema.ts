import { z } from "@hono/zod-openapi";
import { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";

export const TransactionTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction",
	}),
	userId: z.string().openapi({
		description: "ID of the user participating in the transaction",
	}),
	listingId: z.string().openapi({
		description: "ID of the related listing",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
	updatedAt: z.coerce.date().openapi({
		description: "Last update timestamp",
		type: "string",
	}),
	status: TransactionStatusEnumSchema,
	statusUpdatedAt: z.coerce.date().openapi({
		description: "Last status update timestamp",
		type: "string",
	}),
	expiresAt: z.coerce.date().openapi({
		description: "Expiration timestamp",
		type: "string",
	}),
});

export type TransactionTableSchema = typeof TransactionTableSchema;

export namespace TransactionTableSchema {
	export type Type = z.infer<TransactionTableSchema>;
}

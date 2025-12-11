import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/app/transaction/schema/ListingTransactionSideEnumSchema";

export const TransactionLocationDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction location entry",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the transaction referenced by the location",
	}),
	side: TransactionSideEnumSchema,
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

export type TransactionLocationDbSchema = typeof TransactionLocationDbSchema;

export namespace TransactionLocationDbSchema {
	export type Type = z.infer<TransactionLocationDbSchema>;
}

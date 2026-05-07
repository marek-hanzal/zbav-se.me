import { z } from "zod";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";

export const TransactionTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the transaction",
		}),
		userId: z.string().meta({
			description: "ID of the user participating in the transaction",
		}),
		listingId: z.string().meta({
			description: "ID of the related listing",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
		updatedAt: z.coerce.date().meta({
			description: "Last update timestamp",
			type: "string",
		}),
		status: TransactionStatusEnumSchema,
		statusUpdatedAt: z.coerce.date().meta({
			description: "Last status update timestamp",
			type: "string",
		}),
		expiresAt: z.coerce.date().meta({
			description: "Expiration timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "TransactionTable",
		description: "Database row for a transaction.",
	})
	.strip();

export type TransactionTableSchema = typeof TransactionTableSchema;

export namespace TransactionTableSchema {
	export type Type = z.infer<TransactionTableSchema>;
}

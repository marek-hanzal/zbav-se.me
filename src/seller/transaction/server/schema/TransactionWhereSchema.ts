import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";

export const TransactionWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().meta({
			description: "This filter matches the exact listingId",
		}),
		activity: z
			.enum([
				"unread",
				"archived",
			])
			.optional()
			.meta({
				description:
					"Controls if the transaction must also have an activity (user's notification)",
			}),
		status: TransactionStatusEnumSchema.optional().meta({
			description: "This filter matches the current status of the transaction",
		}),
		statusIn: z.array(TransactionStatusEnumSchema).optional().meta({
			description:
				"This filter matches any of the provided statuses for the current status of the transaction",
		}),
	})
	.strip()
	.meta({
		id: "TransactionWhere",
		description: "App-based filters",
	});

export type TransactionWhereSchema = typeof TransactionWhereSchema;

export namespace TransactionWhereSchema {
	export type Type = z.infer<TransactionWhereSchema>;
}

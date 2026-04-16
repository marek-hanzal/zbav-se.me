import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { TransactionFlowEnumSchema } from "~/common/user-transaction/enum/TransactionFlowEnumSchema";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";

export const TransactionFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().meta({
			description: "This filter matches the exact listingId",
		}),
		status: TransactionStatusEnumSchema.optional().meta({
			description: "This filter matches the current status of the transaction",
		}),
		statusIn: z.array(TransactionStatusEnumSchema).optional().meta({
			description:
				"This filter matches any of the provided statuses for the current status of the transaction",
		}),
		flow: TransactionFlowEnumSchema.optional(),
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
	})
	.strip()
	.meta({
		id: "TransactionFilter",
		description: "Filter object for transaction collection",
	});

export type TransactionFilterSchema = typeof TransactionFilterSchema;

export namespace TransactionFilterSchema {
	export type Type = z.infer<TransactionFilterSchema>;
}

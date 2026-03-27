import { FilterSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { TransactionStatusEnumSchema } from "~/@common/user-transaction/enum/TransactionStatusEnumSchema";

export const TransactionFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().meta({
			description: "This filter matches the exact listingId",
		}),
		active: z.boolean().optional().meta({
			description:
				"When true, match transactions with unread inbox activity for the current side; when false, match transactions without unread inbox activity for the current side",
		}),
		terminal: z.boolean().optional().meta({
			description:
				"When true, match transactions already in a terminal status; when false, match transactions that still have a non-terminal status",
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
		id: "TransactionFilter",
		description: "Filter object for transaction collection",
	});

export type TransactionFilterSchema = typeof TransactionFilterSchema;

export namespace TransactionFilterSchema {
	export type Type = z.infer<TransactionFilterSchema>;
}

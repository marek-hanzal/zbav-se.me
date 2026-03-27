import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";

export const TransactionFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().openapi({
			description: "This filter matches the exact listingId",
		}),
		active: z.boolean().optional().openapi({
			description:
				"When true, match transactions with unread inbox activity for the current side; when false, match transactions without unread inbox activity for the current side",
		}),
		terminal: z.boolean().optional().openapi({
			description:
				"When true, match transactions already in a terminal status; when false, match transactions that still have a non-terminal status",
		}),
		status: TransactionStatusEnumSchema.optional().openapi({
			description: "This filter matches the current status of the transaction",
		}),
		statusIn: z.array(TransactionStatusEnumSchema).optional().openapi({
			description:
				"This filter matches any of the provided statuses for the current status of the transaction",
		}),
	})
	.strip()
	.openapi("TransactionFilter", {
		description: "Filter object for transaction collection",
	});

export type TransactionFilterSchema = typeof TransactionFilterSchema;

export namespace TransactionFilterSchema {
	export type Type = z.infer<TransactionFilterSchema>;
}

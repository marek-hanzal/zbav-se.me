import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/app/transaction/schema/TransactionSideEnumSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const TransactionLogFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
		side: TransactionSideEnumSchema.optional(),
		userId: z.string().optional(),
	})
	.openapi("TransactionLogFilter", {
		description: "Filter object for listing transaction log collection",
	});

export type TransactionLogFilterSchema = typeof TransactionLogFilterSchema;

export namespace TransactionLogFilterSchema {
	export type Type = z.infer<TransactionLogFilterSchema>;
}

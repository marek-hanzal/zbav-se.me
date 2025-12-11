import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/app/transaction/schema/TransactionSideEnumSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const MessageFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
		side: TransactionSideEnumSchema.optional(),
	})
	.openapi("MessageFilter", {
		description: "Filter object for listing transaction message",
	});

export type MessageFilterSchema = typeof MessageFilterSchema;

export namespace MessageFilterSchema {
	export type Type = z.infer<MessageFilterSchema>;
}

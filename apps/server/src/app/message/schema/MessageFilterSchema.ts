import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const MessageFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		transactionId: z.string().optional().openapi({
			description: "This filter matches the exact transactionId",
		}),
	})
	.openapi("MessageFilter", {
		description: "Filter object for message collection",
	});

export type MessageFilterSchema = typeof MessageFilterSchema;

export namespace MessageFilterSchema {
	export type Type = z.infer<MessageFilterSchema>;
}

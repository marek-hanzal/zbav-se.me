import { z } from "@hono/zod-openapi";

export const MessageItemSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the message",
		}),
	})
	.openapi("MessageItemSchema", {
		description: "Message collection item",
	});

export type MessageItemSchema = typeof MessageItemSchema;

export namespace MessageItemSchema {
	export type Type = z.infer<MessageItemSchema>;
}

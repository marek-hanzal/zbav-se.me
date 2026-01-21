import { z } from "@hono/zod-openapi";
import { MessageSchema } from "~/app/message/schema/MessageSchema";

export const MessageItemSchema = z
	.looseObject({
		...MessageSchema.shape,
	})
	.strip()
	.openapi("MessageItem", {
		description: "Message collection item",
	});

export type MessageItemSchema = typeof MessageItemSchema;

export namespace MessageItemSchema {
	export type Type = z.infer<MessageItemSchema>;
}

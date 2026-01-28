import { z } from "@hono/zod-openapi";

export const MessageSystemTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the message entry",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the message thread referenced by the message",
	}),
	text: z.string().openapi({
		description: "Message content",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type MessageSystemTableSchema = typeof MessageSystemTableSchema;

export namespace MessageSystemTableSchema {
	export type Type = z.infer<MessageSystemTableSchema>;
}

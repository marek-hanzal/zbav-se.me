import { z } from "@hono/zod-openapi";

export const MessageTextDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the message entry",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the message thread referenced by the message",
	}),
	text: z.string().openapi({
		description: "Message content (database column name)",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type MessageTextDbSchema = typeof MessageTextDbSchema;

export namespace MessageTextDbSchema {
	export type Type = z.infer<MessageTextDbSchema>;
}

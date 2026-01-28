import { z } from "@hono/zod-openapi";

export const MessageTextTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the message entry",
	}),
	userId: z.string().openapi({
		description: "ID of the user who sent the message",
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

export type MessageTextTableSchema = typeof MessageTextTableSchema;

export namespace MessageTextTableSchema {
	export type Type = z.infer<MessageTextTableSchema>;
}

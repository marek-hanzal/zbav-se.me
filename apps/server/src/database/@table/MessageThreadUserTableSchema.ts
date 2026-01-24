import { z } from "@hono/zod-openapi";

export const MessageThreadUserTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the message thread user entry",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the message thread",
	}),
	userId: z.string().openapi({
		description: "ID of the user",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type MessageThreadUserTableSchema = typeof MessageThreadUserTableSchema;

export namespace MessageThreadUserTableSchema {
	export type Type = z.infer<MessageThreadUserTableSchema>;
}

import { z } from "@hono/zod-openapi";

export const MessageDateDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the message date entry",
	}),
	userId: z.string().openapi({
		description: "ID of the user who sent the message",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the message thread referenced by the message",
	}),
	datetime: z.coerce.date().openapi({
		description: "Date and time",
		type: "string",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type MessageDateDbSchema = typeof MessageDateDbSchema;

export namespace MessageDateDbSchema {
	export type Type = z.infer<MessageDateDbSchema>;
}

import { z } from "@hono/zod-openapi";

export const MessageLocationTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the message location entry",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the message thread",
	}),
	userId: z.string().openapi({
		description: "ID of the user",
	}),
	locationId: z.string().openapi({
		description: "ID of the location",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type MessageLocationTableSchema = typeof MessageLocationTableSchema;

export namespace MessageLocationTableSchema {
	export type Type = z.infer<MessageLocationTableSchema>;
}

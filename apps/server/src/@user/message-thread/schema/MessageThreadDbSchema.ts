import { z } from "@hono/zod-openapi";

export const MessageThreadDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the message thread entry",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
	updatedAt: z.coerce.date().openapi({
		description: "Last update timestamp",
		type: "string",
	}),
});

export type MessageThreadDbSchema = typeof MessageThreadDbSchema;

export namespace MessageThreadDbSchema {
	export type Type = z.infer<MessageThreadDbSchema>;
}

import { z } from "@hono/zod-openapi";

export const MessageThreadCreateSchema = z
	.looseObject({
		//
	})
	.strip()
	.openapi("MessageThreadCreate", {
		description: "Request to create a message thread",
	});

export type MessageThreadCreateSchema = typeof MessageThreadCreateSchema;

export namespace MessageThreadCreateSchema {
	export type Type = z.infer<MessageThreadCreateSchema>;
}

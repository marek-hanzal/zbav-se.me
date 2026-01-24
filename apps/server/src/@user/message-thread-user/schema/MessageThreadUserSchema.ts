import { z } from "@hono/zod-openapi";
import { MessageThreadUserDbSchema } from "./MessageThreadUserDbSchema";

export const MessageThreadUserSchema = z
	.looseObject({
		...MessageThreadUserDbSchema.shape,
	})
	.strip()
	.openapi("MessageThreadUser", {
		description: "Message thread user entry",
	});

export type MessageThreadUserSchema = typeof MessageThreadUserSchema;

export namespace MessageThreadUserSchema {
	export type Type = z.infer<MessageThreadUserSchema>;
}

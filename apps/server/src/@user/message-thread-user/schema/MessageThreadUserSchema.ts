import { z } from "@hono/zod-openapi";
import { MessageThreadUserDbSchema } from "~/app/message-thread-user/schema/MessageThreadUserDbSchema";

export const MessageThreadUserSchema = z
	.object({
		...MessageThreadUserDbSchema.shape,
	})
	.omit({
		createdAt: true,
	})
	.openapi("MessageThreadUser", {
		description: "Message thread user entry",
	});

export type MessageThreadUserSchema = typeof MessageThreadUserSchema;

export namespace MessageThreadUserSchema {
	export type Type = z.infer<MessageThreadUserSchema>;
}

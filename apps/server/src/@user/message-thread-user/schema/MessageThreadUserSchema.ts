import { z } from "@hono/zod-openapi";
import { MessageThreadUserTableSchema } from "~/database/@table/MessageThreadUserTableSchema";

export const MessageThreadUserSchema = z
	.looseObject({
		...MessageThreadUserTableSchema.shape,
	})
	.strip()
	.openapi("MessageThreadUser", {
		description: "Message thread user entry",
	});

export type MessageThreadUserSchema = typeof MessageThreadUserSchema;

export namespace MessageThreadUserSchema {
	export type Type = z.infer<MessageThreadUserSchema>;
}

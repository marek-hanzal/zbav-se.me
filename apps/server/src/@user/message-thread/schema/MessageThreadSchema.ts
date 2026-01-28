import { z } from "@hono/zod-openapi";
import { MessageThreadTableSchema } from "~/database/@table/MessageThreadTableSchema";

export const MessageThreadSchema = z
	.looseObject({
		...MessageThreadTableSchema.shape,
	})
	.strip()
	.openapi("MessageThread", {
		description: "Message thread entry",
	});

export type MessageThreadSchema = typeof MessageThreadSchema;

export namespace MessageThreadSchema {
	export type Type = z.infer<MessageThreadSchema>;
}

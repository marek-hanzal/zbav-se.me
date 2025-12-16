import { z } from "@hono/zod-openapi";
import { MessageThreadDbSchema } from "~/app/message-thread/schema/MessageThreadDbSchema";

export const MessageThreadSchema = z
	.object({
		...MessageThreadDbSchema.shape,
	})
	.omit({
		createdAt: true,
		updatedAt: true,
	})
	.openapi("MessageThread", {
		description: "Message thread entry",
	});

export type MessageThreadSchema = typeof MessageThreadSchema;

export namespace MessageThreadSchema {
	export type Type = z.infer<MessageThreadSchema>;
}

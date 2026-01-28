import { z } from "@hono/zod-openapi";
import { MessageThreadUserFilterSchema } from "~/@user/message-thread-user/schema/MessageThreadUserFilterSchema";

export const MessageThreadUserWhereSchema = z
	.object({
		...MessageThreadUserFilterSchema.shape,
	})
	.openapi("MessageThreadUserWhere", {
		description: "App-based filters",
	});

export type MessageThreadUserWhereSchema = typeof MessageThreadUserWhereSchema;

export namespace MessageThreadUserWhereSchema {
	export type Type = z.infer<MessageThreadUserWhereSchema>;
}

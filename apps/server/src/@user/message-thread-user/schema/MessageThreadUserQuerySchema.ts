import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessageThreadUserFilterSchema } from "~/@user/message-thread-user/schema/MessageThreadUserFilterSchema";
import { MessageThreadUserSortSchema } from "~/@user/message-thread-user/schema/MessageThreadUserSortSchema";
import { MessageThreadUserWhereSchema } from "~/@user/message-thread-user/schema/MessageThreadUserWhereSchema";

export const MessageThreadUserQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: MessageThreadUserFilterSchema.optional(),
		where: MessageThreadUserWhereSchema.optional(),
		sort: MessageThreadUserSortSchema.array().optional(),
	})
	.strip()
	.openapi("MessageThreadUserQuery", {
		description: "Query object for message thread user",
	});

export type MessageThreadUserQuerySchema = typeof MessageThreadUserQuerySchema;

export namespace MessageThreadUserQuerySchema {
	export type Type = z.infer<MessageThreadUserQuerySchema>;
}

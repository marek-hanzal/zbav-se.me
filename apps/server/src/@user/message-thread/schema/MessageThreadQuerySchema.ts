import { z } from "@hono/zod-openapi";
import { MessageThreadFilterSchema } from "~/@user/message-thread/schema/MessageThreadFilterSchema";
import { MessageThreadSortSchema } from "~/@user/message-thread/schema/MessageThreadSortSchema";
import { MessageThreadWhereSchema } from "~/@user/message-thread/schema/MessageThreadWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const MessageThreadQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessageThreadFilterSchema.optional(),
		where: MessageThreadWhereSchema.optional(),
		sort: MessageThreadSortSchema.array().optional(),
	})
	.openapi("MessageThreadQuery", {
		description: "Query object for message thread",
	});

export type MessageThreadQuerySchema = typeof MessageThreadQuerySchema;

export namespace MessageThreadQuerySchema {
	export type Type = z.infer<MessageThreadQuerySchema>;
}

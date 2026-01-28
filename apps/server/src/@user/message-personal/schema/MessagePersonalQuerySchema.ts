import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessagePersonalFilterSchema } from "~/@user/message-personal/schema/MessagePersonalFilterSchema";
import { MessagePersonalSortSchema } from "~/@user/message-personal/schema/MessagePersonalSortSchema";
import { MessagePersonalWhereSchema } from "~/@user/message-personal/schema/MessagePersonalWhereSchema";

export const MessagePersonalQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: MessagePersonalFilterSchema.optional(),
		where: MessagePersonalWhereSchema.optional(),
		sort: MessagePersonalSortSchema.array().optional(),
	})
	.strip()
	.openapi("MessagePersonalQuery", {
		description: "Query object for message personal collection",
	});

export type MessagePersonalQuerySchema = typeof MessagePersonalQuerySchema;

export namespace MessagePersonalQuerySchema {
	export type Type = z.infer<MessagePersonalQuerySchema>;
}

import { z } from "@hono/zod-openapi";
import { MessagePersonalFilterSchema } from "~/@user/message-personal/schema/MessagePersonalFilterSchema";
import { MessagePersonalSortSchema } from "~/@user/message-personal/schema/MessagePersonalSortSchema";
import { MessagePersonalWhereSchema } from "~/@user/message-personal/schema/MessagePersonalWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

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

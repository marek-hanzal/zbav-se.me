import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessagePersonalFilterSchema } from "~/@user/message-personal/schema/MessagePersonalFilterSchema";
import { MessagePersonalSortSchema } from "~/@user/message-personal/schema/MessagePersonalSortSchema";

export const MessagePersonalQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessagePersonalFilterSchema.optional(),
		where: MessagePersonalFilterSchema.openapi("MessagePersonalWhere", {
			description: "App-based filters",
		}).optional(),
		sort: MessagePersonalSortSchema.array().optional(),
	})
	.openapi("MessagePersonalQuery", {
		description: "Query object for message personal collection",
	});

export type MessagePersonalQuerySchema = typeof MessagePersonalQuerySchema;

export namespace MessagePersonalQuerySchema {
	export type Type = z.infer<MessagePersonalQuerySchema>;
}

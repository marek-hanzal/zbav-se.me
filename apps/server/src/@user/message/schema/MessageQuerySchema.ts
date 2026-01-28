import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessageFilterSchema } from "~/@user/message/schema/MessageFilterSchema";
import { MessageSortSchema } from "~/@user/message/schema/MessageSortSchema";

export const MessageQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessageFilterSchema.optional(),
		where: MessageFilterSchema.openapi("MessageWhere", {
			description: "App-based filters",
		}).optional(),
		sort: MessageSortSchema.array().optional(),
	})
	.openapi("MessageQuery", {
		description: "Query object for message collection",
	});

export type MessageQuerySchema = typeof MessageQuerySchema;

export namespace MessageQuerySchema {
	export type Type = z.infer<MessageQuerySchema>;
}

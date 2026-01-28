import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessageTextFilterSchema } from "~/@user/message-text/schema/MessageTextFilterSchema";
import { MessageTextSortSchema } from "~/@user/message-text/schema/MessageTextSortSchema";
import { MessageTextWhereSchema } from "~/@user/message-text/schema/MessageTextWhereSchema";

export const MessageTextQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessageTextFilterSchema.optional(),
		where: MessageTextWhereSchema.optional(),
		sort: MessageTextSortSchema.array().optional(),
	})
	.openapi("MessageTextQuery", {
		description: "Query object for listing transaction message",
	});

export type MessageTextQuerySchema = typeof MessageTextQuerySchema;

export namespace MessageTextQuerySchema {
	export type Type = z.infer<MessageTextQuerySchema>;
}

import { z } from "@hono/zod-openapi";
import { MessageFilterSchema } from "~/@user/message/schema/MessageFilterSchema";
import { MessageSortSchema } from "~/@user/message/schema/MessageSortSchema";
import { MessageWhereSchema } from "~/@user/message/schema/MessageWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const MessageQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: MessageFilterSchema.optional(),
		where: MessageWhereSchema.optional(),
		sort: MessageSortSchema.array().optional(),
	})
	.strip()
	.openapi("MessageQuery", {
		description: "Query object for message collection",
	});

export type MessageQuerySchema = typeof MessageQuerySchema;

export namespace MessageQuerySchema {
	export type Type = z.infer<MessageQuerySchema>;
}

import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessageFilterSchema } from "~/@user/message/schema/MessageFilterSchema";
import { MessageSortSchema } from "~/@user/message/schema/MessageSortSchema";
import { MessageWhereSchema } from "~/@user/message/schema/MessageWhereSchema";

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

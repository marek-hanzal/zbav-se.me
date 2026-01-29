import { z } from "@hono/zod-openapi";
import { MessageSystemFilterSchema } from "~/@user/message-system/schema/MessageSystemFilterSchema";
import { MessageSystemSortSchema } from "~/@user/message-system/schema/MessageSystemSortSchema";
import { MessageSystemWhereSchema } from "~/@user/message-system/schema/MessageSystemWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const MessageSystemQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessageSystemFilterSchema.optional(),
		where: MessageSystemWhereSchema.optional(),
		sort: MessageSystemSortSchema.array().optional(),
	})
	.openapi("MessageSystemQuery", {
		description: "Query object for system message",
	});

export type MessageSystemQuerySchema = typeof MessageSystemQuerySchema;

export namespace MessageSystemQuerySchema {
	export type Type = z.infer<MessageSystemQuerySchema>;
}

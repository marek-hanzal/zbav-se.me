import { z } from "@hono/zod-openapi";
import { MessageSystemFilterSchema } from "~/@user/message-system/schema/MessageSystemFilterSchema";

export const MessageSystemWhereSchema = z
	.object({
		...MessageSystemFilterSchema.shape,
	})
	.openapi("MessageSystemWhere", {
		description: "App-based filters",
	});

export type MessageSystemWhereSchema = typeof MessageSystemWhereSchema;

export namespace MessageSystemWhereSchema {
	export type Type = z.infer<MessageSystemWhereSchema>;
}

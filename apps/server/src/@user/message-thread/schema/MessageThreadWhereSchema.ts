import { z } from "@hono/zod-openapi";
import { MessageThreadFilterSchema } from "~/@user/message-thread/schema/MessageThreadFilterSchema";

export const MessageThreadWhereSchema = z
	.object({
		...MessageThreadFilterSchema.shape,
	})
	.openapi("MessageThreadWhere", {
		description: "App-based filters",
	});

export type MessageThreadWhereSchema = typeof MessageThreadWhereSchema;

export namespace MessageThreadWhereSchema {
	export type Type = z.infer<MessageThreadWhereSchema>;
}

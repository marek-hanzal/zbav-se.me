import { z } from "@hono/zod-openapi";
import { MessageFilterSchema } from "~/@user/message/schema/MessageFilterSchema";

export const MessageWhereSchema = z
	.object({
		...MessageFilterSchema.shape,
	})
	.openapi("MessageWhere", {
		description: "App-based filters",
	});

export type MessageWhereSchema = typeof MessageWhereSchema;

export namespace MessageWhereSchema {
	export type Type = z.infer<MessageWhereSchema>;
}

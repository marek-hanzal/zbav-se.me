import { z } from "@hono/zod-openapi";
import { MessagePersonalFilterSchema } from "~/@user/message-personal/schema/MessagePersonalFilterSchema";

export const MessagePersonalWhereSchema = z
	.object({
		...MessagePersonalFilterSchema.shape,
	})
	.openapi("MessagePersonalWhere", {
		description: "App-based filters",
	});

export type MessagePersonalWhereSchema = typeof MessagePersonalWhereSchema;

export namespace MessagePersonalWhereSchema {
	export type Type = z.infer<MessagePersonalWhereSchema>;
}

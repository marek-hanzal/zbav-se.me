import { z } from "@hono/zod-openapi";
import { MessageThreadQuerySchema } from "~/@user/message-thread/schema/MessageThreadQuerySchema";

export const MessageThreadPatchSchema = z
	.object({
		query: MessageThreadQuerySchema,
	})
	.openapi("MessageThreadPatch", {
		description: "Data for updating an existing message thread",
	});

export type MessageThreadPatchSchema = typeof MessageThreadPatchSchema;

export namespace MessageThreadPatchSchema {
	export type Type = z.infer<MessageThreadPatchSchema>;
}

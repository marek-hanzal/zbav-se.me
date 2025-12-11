import { z } from "@hono/zod-openapi";
import { MessageQuerySchema } from "~/@user/message/schema/MessageQuerySchema";

export const MessageThreadPatchSchema = z
	.object({
		query: MessageQuerySchema,
	})
	.openapi("MessageThreadPatch", {
		description: "Data for updating an existing message thread",
	});

export type MessageThreadPatchSchema = typeof MessageThreadPatchSchema;

export namespace MessageThreadPatchSchema {
	export type Type = z.infer<MessageThreadPatchSchema>;
}

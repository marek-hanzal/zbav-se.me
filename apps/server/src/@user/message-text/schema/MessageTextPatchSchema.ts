import { z } from "@hono/zod-openapi";
import { MessageTextQuerySchema } from "~/app/message-text/schema/MessageTextQuerySchema";

export const MessageTextPatchSchema = z
	.object({
		query: MessageTextQuerySchema,
	})
	.openapi("MessageTextPatch", {
		description: "Data for updating an existing message text",
	});

export type MessageTextPatchSchema = typeof MessageTextPatchSchema;

export namespace MessageTextPatchSchema {
	export type Type = z.infer<MessageTextPatchSchema>;
}

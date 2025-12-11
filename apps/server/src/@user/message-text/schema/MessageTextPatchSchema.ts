import { z } from "@hono/zod-openapi";
import { MessageQuerySchema } from "~/app/message/schema/MessageQuerySchema";

export const MessageTextPatchSchema = z
	.object({
		query: MessageQuerySchema,
	})
	.openapi("MessageTextPatch", {
		description: "Data for updating an existing message text",
	});

export type MessageTextPatchSchema = typeof MessageTextPatchSchema;

export namespace MessageTextPatchSchema {
	export type Type = z.infer<MessageTextPatchSchema>;
}

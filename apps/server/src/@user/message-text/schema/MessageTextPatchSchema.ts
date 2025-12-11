import { z } from "@hono/zod-openapi";
import { MessageTextDbSchema } from "~/app/message-text/schema/MessageTextDbSchema";
import { MessageTextQuerySchema } from "~/app/message-text/schema/MessageTextQuerySchema";

export const MessageTextPatchSchema = z
	.object({
		patch: z
			.object({
				...MessageTextDbSchema.shape,
			})
			.omit({
				id: true,
				messageThreadId: true,
				createdAt: true,
			})
			.partial()
			.openapi({
				description: "Fields to update (all optional)",
			}),
		query: MessageTextQuerySchema,
	})
	.openapi("MessageTextPatch", {
		description: "Data for updating an existing message text",
	});

export type MessageTextPatchSchema = typeof MessageTextPatchSchema;

export namespace MessageTextPatchSchema {
	export type Type = z.infer<MessageTextPatchSchema>;
}

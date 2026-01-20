import { z } from "@hono/zod-openapi";
import { MessageTextDbSchema } from "~/app/message-text/schema/MessageTextDbSchema";
import { MessageTextQuerySchema } from "~/app/message-text/schema/MessageTextQuerySchema";

export const MessageTextPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...MessageTextDbSchema.shape,
			})
			.omit({
				id: true,
				messageThreadId: true,
				userId: true,
				createdAt: true,
			})
			.strip()
			.partial()
			.openapi({
				description: "Fields to update (all optional)",
			}),
		query: MessageTextQuerySchema,
	})
	.strip()
	.openapi("MessageTextPatch", {
		description: "Data for updating an existing message text",
	});

export type MessageTextPatchSchema = typeof MessageTextPatchSchema;

export namespace MessageTextPatchSchema {
	export type Type = z.infer<MessageTextPatchSchema>;
}

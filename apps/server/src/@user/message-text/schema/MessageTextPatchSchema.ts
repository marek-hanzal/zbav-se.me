import { z } from "@hono/zod-openapi";
import { MessageTextQuerySchema } from "~/@user/message-text/schema/MessageTextQuerySchema";
import { MessageTextTableSchema } from "~/database/@table/MessageTextTableSchema";

export const MessageTextPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...MessageTextTableSchema.shape,
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

import { z } from "@hono/zod-openapi";
import { MessageThreadDbSchema } from "~/app/message-thread/schema/MessageThreadDbSchema";
import { MessageThreadQuerySchema } from "~/app/message-thread/schema/MessageThreadQuerySchema";

export const MessageThreadPatchSchema = z
	.object({
		patch: z
			.object({
				...MessageThreadDbSchema.shape,
			})
			.omit({
				id: true,
				createdAt: true,
				updatedAt: true,
			})
			.partial()
			.openapi({
				description: "Fields to update (all optional)",
			}),
		query: MessageThreadQuerySchema,
	})
	.openapi("MessageThreadPatch", {
		description: "Data for updating an existing message thread",
	});

export type MessageThreadPatchSchema = typeof MessageThreadPatchSchema;

export namespace MessageThreadPatchSchema {
	export type Type = z.infer<MessageThreadPatchSchema>;
}

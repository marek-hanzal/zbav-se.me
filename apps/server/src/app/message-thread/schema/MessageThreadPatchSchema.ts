import { z } from "@hono/zod-openapi";
import { MessageThreadDbSchema } from "~/app/message-thread/schema/MessageThreadDbSchema";
import { MessageThreadQuerySchema } from "~/app/message-thread/schema/MessageThreadQuerySchema";

export const MessageThreadPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...MessageThreadDbSchema.shape,
			})
			.omit({
				id: true,
				createdAt: true,
			})
			.strip()
			.partial()
			.openapi({
				description: "Fields to update (all optional)",
			}),
		query: MessageThreadQuerySchema,
	})
	.strip()
	.openapi("MessageThreadPatch", {
		description: "Data for updating an existing message thread",
	});

export type MessageThreadPatchSchema = typeof MessageThreadPatchSchema;

export namespace MessageThreadPatchSchema {
	export type Type = z.infer<MessageThreadPatchSchema>;
}

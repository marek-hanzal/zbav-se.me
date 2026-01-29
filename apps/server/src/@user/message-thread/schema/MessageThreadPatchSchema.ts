import { z } from "@hono/zod-openapi";
import { MessageThreadQuerySchema } from "~/@user/message-thread/schema/MessageThreadQuerySchema";
import { MessageThreadTableSchema } from "~/database/@table/MessageThreadTableSchema";

export const MessageThreadPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...MessageThreadTableSchema.shape,
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

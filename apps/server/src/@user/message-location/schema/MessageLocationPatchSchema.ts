import { z } from "@hono/zod-openapi";
import { MessageLocationDbSchema } from "~/app/message-location/schema/MessageLocationDbSchema";
import { MessageLocationQuerySchema } from "~/app/message-location/schema/MessageLocationQuerySchema";

export const MessageLocationPatchSchema = z
	.object({
		patch: z
			.object({
				...MessageLocationDbSchema.shape,
			})
			.omit({
				id: true,
				messageThreadId: true,
				userId: true,
				createdAt: true,
			})
			.partial()
			.openapi({
				description: "Fields to update (all optional)",
			}),
		query: MessageLocationQuerySchema,
	})
	.openapi("MessageLocationPatch", {
		description: "Data for updating an existing message location",
	});

export type MessageLocationPatchSchema = typeof MessageLocationPatchSchema;

export namespace MessageLocationPatchSchema {
	export type Type = z.infer<MessageLocationPatchSchema>;
}

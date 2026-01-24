import { z } from "@hono/zod-openapi";
import { MessageLocationDbSchema } from "./MessageLocationDbSchema";
import { MessageLocationQuerySchema } from "./MessageLocationQuerySchema";

export const MessageLocationPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...MessageLocationDbSchema.shape,
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
		query: MessageLocationQuerySchema,
	})
	.strip()
	.openapi("MessageLocationPatch", {
		description: "Data for updating an existing message location",
	});

export type MessageLocationPatchSchema = typeof MessageLocationPatchSchema;

export namespace MessageLocationPatchSchema {
	export type Type = z.infer<MessageLocationPatchSchema>;
}

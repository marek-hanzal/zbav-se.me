import { z } from "@hono/zod-openapi";
import { MessageLocationQuerySchema } from "~/app/message-location/schema/MessageLocationQuerySchema";

export const MessageLocationPatchSchema = z
	.object({
		query: MessageLocationQuerySchema,
	})
	.openapi("MessageLocationPatch", {
		description: "Data for updating an existing message location",
	});

export type MessageLocationPatchSchema = typeof MessageLocationPatchSchema;

export namespace MessageLocationPatchSchema {
	export type Type = z.infer<MessageLocationPatchSchema>;
}

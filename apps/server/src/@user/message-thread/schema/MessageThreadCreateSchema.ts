import { z } from "zod";

export const MessageThreadCreateSchema = z
	.object({
		id: z.string().optional().openapi({
			description:
				"The ID of the message thread. If not provided, a new ID will be generated",
		}),
	})
	.openapi("MessageThreadCreate", {
		description: "Request to create a message thread",
	});

export type MessageThreadCreateSchema = typeof MessageThreadCreateSchema;

export namespace MessageThreadCreateSchema {
	export type Type = z.infer<MessageThreadCreateSchema>;
}

import { z } from "zod";
import { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";

export const AssistantChatMessageCreatedStreamEventSchema = z
	.object({
		type: z.literal("message.created"),
		message: AssistantChatMessageSchema,
	})
	.meta({
		id: "AssistantChatMessageCreatedStreamEvent",
		description: "Assistant chat stream event for a newly created message",
	});

export type AssistantChatMessageCreatedStreamEventSchema =
	typeof AssistantChatMessageCreatedStreamEventSchema;

export namespace AssistantChatMessageCreatedStreamEventSchema {
	export type Type = z.infer<AssistantChatMessageCreatedStreamEventSchema>;
}

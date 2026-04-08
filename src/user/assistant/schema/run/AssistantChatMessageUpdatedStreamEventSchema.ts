import { z } from "zod";
import { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";

export const AssistantChatMessageUpdatedStreamEventSchema = z
	.object({
		type: z.literal("message.updated"),
		message: AssistantChatMessageSchema,
	})
	.meta({
		id: "AssistantChatMessageUpdatedStreamEvent",
		description: "Assistant chat stream event for an updated message",
	});

export type AssistantChatMessageUpdatedStreamEventSchema =
	typeof AssistantChatMessageUpdatedStreamEventSchema;

export namespace AssistantChatMessageUpdatedStreamEventSchema {
	export type Type = z.infer<AssistantChatMessageUpdatedStreamEventSchema>;
}

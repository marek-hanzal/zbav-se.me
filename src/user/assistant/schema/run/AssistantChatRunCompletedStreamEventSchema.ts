import { z } from "zod";

export const AssistantChatRunCompletedStreamEventSchema = z
	.object({
		type: z.literal("run.completed"),
	})
	.meta({
		id: "AssistantChatRunCompletedStreamEvent",
		description: "Assistant chat stream event emitted when a run completes",
	});

export type AssistantChatRunCompletedStreamEventSchema =
	typeof AssistantChatRunCompletedStreamEventSchema;

export namespace AssistantChatRunCompletedStreamEventSchema {
	export type Type = z.infer<AssistantChatRunCompletedStreamEventSchema>;
}

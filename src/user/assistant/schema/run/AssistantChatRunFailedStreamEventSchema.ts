import { z } from "zod";

export const AssistantChatRunFailedStreamEventSchema = z
	.object({
		type: z.literal("run.failed"),
		error: z.string(),
	})
	.meta({
		id: "AssistantChatRunFailedStreamEvent",
		description: "Assistant chat stream event emitted when a run fails",
	});

export type AssistantChatRunFailedStreamEventSchema =
	typeof AssistantChatRunFailedStreamEventSchema;

export namespace AssistantChatRunFailedStreamEventSchema {
	export type Type = z.infer<AssistantChatRunFailedStreamEventSchema>;
}

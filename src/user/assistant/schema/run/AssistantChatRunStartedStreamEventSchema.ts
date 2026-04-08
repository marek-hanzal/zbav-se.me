import { z } from "zod";

export const AssistantChatRunStartedStreamEventSchema = z
	.object({
		type: z.literal("run.started"),
	})
	.meta({
		id: "AssistantChatRunStartedStreamEvent",
		description: "Assistant chat stream event emitted when a run starts",
	});

export type AssistantChatRunStartedStreamEventSchema =
	typeof AssistantChatRunStartedStreamEventSchema;

export namespace AssistantChatRunStartedStreamEventSchema {
	export type Type = z.infer<AssistantChatRunStartedStreamEventSchema>;
}

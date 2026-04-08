import { z } from "zod";

export const AssistantChatRunAbortedStreamEventSchema = z
	.object({
		type: z.literal("run.aborted"),
	})
	.meta({
		id: "AssistantChatRunAbortedStreamEvent",
		description: "Assistant chat stream event emitted when a run is aborted",
	});

export type AssistantChatRunAbortedStreamEventSchema =
	typeof AssistantChatRunAbortedStreamEventSchema;

export namespace AssistantChatRunAbortedStreamEventSchema {
	export type Type = z.infer<AssistantChatRunAbortedStreamEventSchema>;
}

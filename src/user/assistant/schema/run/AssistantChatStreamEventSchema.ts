import { z } from "zod";
import { AssistantChatMessageCreatedStreamEventSchema } from "~/user/assistant/schema/run/AssistantChatMessageCreatedStreamEventSchema";
import { AssistantChatMessageUpdatedStreamEventSchema } from "~/user/assistant/schema/run/AssistantChatMessageUpdatedStreamEventSchema";
import { AssistantChatRunAbortedStreamEventSchema } from "~/user/assistant/schema/run/AssistantChatRunAbortedStreamEventSchema";
import { AssistantChatRunCompletedStreamEventSchema } from "~/user/assistant/schema/run/AssistantChatRunCompletedStreamEventSchema";
import { AssistantChatRunFailedStreamEventSchema } from "~/user/assistant/schema/run/AssistantChatRunFailedStreamEventSchema";
import { AssistantChatRunStartedStreamEventSchema } from "~/user/assistant/schema/run/AssistantChatRunStartedStreamEventSchema";

export const AssistantChatStreamEventSchema = z
	.discriminatedUnion("type", [
		AssistantChatMessageCreatedStreamEventSchema,
		AssistantChatMessageUpdatedStreamEventSchema,
		AssistantChatRunStartedStreamEventSchema,
		AssistantChatRunCompletedStreamEventSchema,
		AssistantChatRunAbortedStreamEventSchema,
		AssistantChatRunFailedStreamEventSchema,
	])
	.meta({
		id: "AssistantChatStreamEvent",
		description: "Normalized assistant chat stream event for the UI",
	});

export type AssistantChatStreamEventSchema = typeof AssistantChatStreamEventSchema;

export namespace AssistantChatStreamEventSchema {
	export type Type = z.infer<AssistantChatStreamEventSchema>;
}

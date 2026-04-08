import { z } from "zod";
import { AssistantChatRoleSchema } from "~/user/assistant/schema/AssistantChatRoleSchema";
import { AssistantChatPartSchema } from "~/user/assistant/schema/part/AssistantChatPartSchema";

export const AssistantChatMessageSchema = z
	.object({
		id: z.string(),
		role: AssistantChatRoleSchema,
		parts: AssistantChatPartSchema.array(),
	})
	.meta({
		id: "AssistantChatMessage",
		description: "Normalized assistant chat message for the UI",
	});

export type AssistantChatMessageSchema = typeof AssistantChatMessageSchema;

export namespace AssistantChatMessageSchema {
	export type Type = z.infer<AssistantChatMessageSchema>;
}

import { z } from "zod";

export const AssistantChatRoleSchema = z
	.enum([
		"user",
		"assistant",
		"system",
	])
	.meta({
		id: "AssistantChatRole",
		description: "Role of an assistant chat message",
	});

export type AssistantChatRoleSchema = typeof AssistantChatRoleSchema;

export namespace AssistantChatRoleSchema {
	export type Type = z.infer<AssistantChatRoleSchema>;
}

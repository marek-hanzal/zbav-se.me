import { z } from "zod";

export const AssistantChatPartTypeEnumSchema = z
	.enum([
		"text",
		"reasoning",
		"tool_call",
	])
	.meta({
		id: "AssistantChatPartTypeEnum",
		description: "Allowed assistant chat part types",
	});

export type AssistantChatPartTypeEnumSchema = typeof AssistantChatPartTypeEnumSchema;

export namespace AssistantChatPartTypeEnumSchema {
	export type Type = z.infer<AssistantChatPartTypeEnumSchema>;
}

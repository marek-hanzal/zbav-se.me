import type { z } from "zod";
import { AssistantChatTableSchema } from "~/server/database/@table/AssistantChatTableSchema";

export const AssistantChatSchema = AssistantChatTableSchema.strip().meta({
	id: "AssistantChat",
	description: "AssistantChat data",
});

export type AssistantChatSchema = typeof AssistantChatSchema;

export namespace AssistantChatSchema {
	export type Type = z.infer<AssistantChatSchema>;
}

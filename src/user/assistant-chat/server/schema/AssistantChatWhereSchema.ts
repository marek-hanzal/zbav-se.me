import { z } from "zod";
import { AssistantChatFilterSchema } from "~/user/assistant-chat/server/schema/AssistantChatFilterSchema";

export const AssistantChatWhereSchema = z
	.looseObject({
		...AssistantChatFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "AssistantWhere",
		description: "App-based filters",
	});

export type AssistantChatWhereSchema = typeof AssistantChatWhereSchema;

export namespace AssistantChatWhereSchema {
	export type Type = z.infer<AssistantChatWhereSchema>;
}

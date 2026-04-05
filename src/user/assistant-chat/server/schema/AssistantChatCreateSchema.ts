import { z } from "zod";

export const AssistantChatCreateSchema = z
	.looseObject({
		payload: z.record(z.string(), z.unknown()),
	})
	.strip()
	.meta({
		id: "AssistantCreate",
		description: "Assistant create input",
	});

export type AssistantChatCreateSchema = typeof AssistantChatCreateSchema;

export namespace AssistantChatCreateSchema {
	export type Type = z.infer<AssistantChatCreateSchema>;
}

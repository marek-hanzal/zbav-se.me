import { z } from "zod";

export const AssistantChatTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the assistant chat",
		}),
		userId: z.string().meta({
			description: "ID of the user",
		}),
		payload: z.record(z.string(), z.any()).meta({
			description: "JSON payload for the assistant chat",
		}),
		createdAt: z.iso.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "AssistantChatTable",
		description: "Database row for an assistant chat.",
	})
	.strip();

export type AssistantChatTableSchema = typeof AssistantChatTableSchema;

export namespace AssistantChatTableSchema {
	export type Type = z.infer<AssistantChatTableSchema>;
}

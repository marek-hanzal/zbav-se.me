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
		sort: z.int().meta({
			description: "The order of this message in the chat; sorting authority",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
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

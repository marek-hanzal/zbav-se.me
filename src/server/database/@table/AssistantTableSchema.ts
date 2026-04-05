import { z } from "zod";

export const AssistantTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the assistant",
		}),
		userId: z.string().meta({
			description: "ID of the user",
		}),
		payload: z.record(z.string(), z.any()).meta({
			description: "JSON payload for the assistant",
		}),
		createdAt: z.iso.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "AssistantTable",
		description: "Database row for an assistant.",
	})
	.strip();

export type AssistantTableSchema = typeof AssistantTableSchema;

export namespace AssistantTableSchema {
	export type Type = z.infer<AssistantTableSchema>;
}

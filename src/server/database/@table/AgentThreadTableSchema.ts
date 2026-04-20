import { z } from "zod";

export const AgentThreadTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the agent thread",
		}),
		userId: z.string().meta({
			description: "ID of the user",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
		updatedAt: z.coerce.date().meta({
			description: "Last update timestamp",
			type: "string",
		}),
		archivedAt: z.coerce.date().nullable().meta({
			description: "Archive timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "AgentThreadTable",
		description: "Database row for an agent thread.",
	})
	.strip();

export type AgentThreadTableSchema = typeof AgentThreadTableSchema;

export namespace AgentThreadTableSchema {
	export type Type = z.infer<AgentThreadTableSchema>;
}

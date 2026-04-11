import { z } from "zod";

export const AgentStreamTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the agent stream row",
		}),
		userId: z.string().meta({
			description: "ID of the user",
		}),
		threadId: z.string().meta({
			description: "ID of the agent thread",
		}),
		/**
		 * We're casting to a target type being optimistic the structure would be compatible/OK/somewhat ephemeral
		 */
		payload: z.record(z.string(), z.any()).meta({
			description: "Payload for the agent stream",
		}),
		sort: z.int().meta({
			description: "The order of this message in the stream; sorting authority",
		}),
	})
	.meta({
		id: "AgentStreamTable",
		description: "Database row for an agent stream.",
	})
	.strip();

export type AgentStreamTableSchema = typeof AgentStreamTableSchema;

export namespace AgentStreamTableSchema {
	export type Type = z.infer<AgentStreamTableSchema>;
}

import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const AgentThreadFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "Exact user id",
		}),
		archivedAt: z
			.enum([
				"archived",
				"active",
				"any",
			])
			.optional()
			.meta({
				id: "AgentThreadArchivedAtFilter",
				description: "Filter by archive state",
			}),
	})
	.strip()
	.meta({
		id: "AgentThreadFilter",
		description: "Filter object for agent thread collection",
	});

export type AgentThreadFilterSchema = typeof AgentThreadFilterSchema;

export namespace AgentThreadFilterSchema {
	export type Type = z.infer<AgentThreadFilterSchema>;
}

import { z } from "zod";
import { OrderEnumSchema } from "~/query/schema/OrderEnumSchema";

export const AgentThreadSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
				"updatedAt",
			])
			.meta({
				id: "AgentThreadSortField",
				description: "Sortable fields",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "AgentThreadSort",
		description: "Sort object for agent thread",
	});

export type AgentThreadSortSchema = typeof AgentThreadSortSchema;

export namespace AgentThreadSortSchema {
	export type Type = z.infer<AgentThreadSortSchema>;

	export type Field = Type["field"];
}

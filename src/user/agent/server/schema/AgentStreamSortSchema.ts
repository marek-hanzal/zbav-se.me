import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const AgentStreamSortSchema = z
	.looseObject({
		field: z
			.enum([
				"sort",
			])
			.meta({
				id: "AgentStreamSortField",
				description: "Field of the agent stream sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "AgentStreamSort",
		description: "Sort object for agent stream collection",
	});

export type AgentStreamSortSchema = typeof AgentStreamSortSchema;

export namespace AgentStreamSortSchema {
	export type Type = z.infer<AgentStreamSortSchema>;

	export type Field = Type["field"];
}

import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const AgentUsageSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.meta({
				id: "AgentUsageSortField",
				description: "Field of the agent usage sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "AgentUsageSort",
		description: "Sort object for agent usage collection",
	});

export type AgentUsageSortSchema = typeof AgentUsageSortSchema;

export namespace AgentUsageSortSchema {
	export type Type = z.infer<AgentUsageSortSchema>;

	export type Field = Type["field"];
}

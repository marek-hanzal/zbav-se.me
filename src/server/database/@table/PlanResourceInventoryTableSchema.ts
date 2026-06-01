import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const PlanResourceInventoryTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the plan resource inventory row",
		}),
		planId: z.string().meta({
			description: "ID of the plan providing the inventory",
		}),
		resourceDefinitionId: ResourceDefinitionEnumSchema.meta({
			description: "Referenced resource definition name",
		}),
		amount: z.coerce.number().meta({
			description: "Inventory amount granted by the plan",
			type: "number",
		}),
		expiration: z.coerce.number().nullable().meta({
			description: "Inventory expiration duration in seconds, or null for never-expiring",
			type: "number",
		}),
	})
	.meta({
		id: "PlanResourceInventoryTable",
		description: "Database row for inventory granted by a monetization plan.",
	})
	.strip();

export type PlanResourceInventoryTableSchema = typeof PlanResourceInventoryTableSchema;

export namespace PlanResourceInventoryTableSchema {
	export type Type = z.infer<PlanResourceInventoryTableSchema>;
}

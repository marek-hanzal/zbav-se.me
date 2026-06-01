import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const PlanResourceLimitTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the plan resource limit row",
		}),
		planId: z.string().meta({
			description: "ID of the plan providing the limit",
		}),
		resourceDefinitionId: ResourceDefinitionEnumSchema.meta({
			description: "Referenced resource definition name",
		}),
		duration: z.coerce.number().nullable().meta({
			description: "Limit duration in seconds, or null for never-ending",
			type: "number",
		}),
	})
	.meta({
		id: "PlanResourceLimitTable",
		description: "Database row for a resource limit granted by a monetization plan.",
	})
	.strip();

export type PlanResourceLimitTableSchema = typeof PlanResourceLimitTableSchema;

export namespace PlanResourceLimitTableSchema {
	export type Type = z.infer<PlanResourceLimitTableSchema>;
}

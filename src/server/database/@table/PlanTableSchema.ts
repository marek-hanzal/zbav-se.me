import { z } from "zod";

export const PlanTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the monetization plan",
		}),
		name: z.string().meta({
			description: "Unique display name of the monetization plan",
		}),
	})
	.meta({
		id: "PlanTable",
		description: "Database row for a monetization plan.",
	})
	.strip();

export type PlanTableSchema = typeof PlanTableSchema;

export namespace PlanTableSchema {
	export type Type = z.infer<PlanTableSchema>;
}

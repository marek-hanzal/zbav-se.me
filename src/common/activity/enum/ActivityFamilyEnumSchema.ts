import { z } from "zod";

export const ActivityFamilyEnumSchema = z
	.enum([
		"transaction",
		"reaction",
	])
	.meta({
		id: "ActivityFamilyEnum",
		description: "Activity family",
	});

export type ActivityFamilyEnumSchema = typeof ActivityFamilyEnumSchema;

export namespace ActivityFamilyEnumSchema {
	export type Type = z.infer<ActivityFamilyEnumSchema>;
}

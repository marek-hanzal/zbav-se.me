import { z } from "zod";

export const ActivityEnumSchema = z
	.enum([
		"low",
		"medium",
		"high",
	])
	.meta({
		id: "ActivityEnum",
		description: "Activity bucket (last user-scoped event age: high = recent, low = old)",
	});

export type ActivityEnumSchema = typeof ActivityEnumSchema;

export namespace ActivityEnumSchema {
	export type Type = z.infer<ActivityEnumSchema>;
}

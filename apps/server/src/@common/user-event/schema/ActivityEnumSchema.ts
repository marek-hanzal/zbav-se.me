import { z } from "@hono/zod-openapi";

export const ActivityEnumSchema = z
	.enum([
		"low",
		"medium",
		"high",
	])
	.openapi("ActivityEnum", {
		description: "Activity bucket (last user-scoped event age: high = recent, low = old)",
	});

export type ActivityEnumSchema = typeof ActivityEnumSchema;

export namespace ActivityEnumSchema {
	export type Type = z.infer<ActivityEnumSchema>;
}

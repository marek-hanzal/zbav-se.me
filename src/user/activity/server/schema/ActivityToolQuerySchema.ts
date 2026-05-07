import { z } from "zod";
import { ActivityQuerySchema } from "./ActivityQuerySchema";
import { ActivityToolFilterSchema } from "./ActivityToolFilterSchema";

export const ActivityToolQuerySchema = z
	.looseObject({
		...ActivityQuerySchema.shape,
		filter: ActivityToolFilterSchema.optional(),
		where: ActivityToolFilterSchema.optional(),
	})
	.omit({
		where: true,
		limit: true,
	})
	.strip()
	.meta({
		id: "ActivityToolQuery",
		description: "Query object for activity tools",
	});

export type ActivityToolQuerySchema = typeof ActivityToolQuerySchema;

export namespace ActivityToolQuerySchema {
	export type Type = z.infer<ActivityToolQuerySchema>;
}

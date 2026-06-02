import { z } from "zod";
import { ActivityQuerySchema } from "./ActivityQuerySchema";
import { ActivityToolWhereSchema } from "./ActivityToolWhereSchema";

export const ActivityToolQuerySchema = z
	.looseObject({
		...ActivityQuerySchema.shape,
		where: ActivityToolWhereSchema.optional(),
	})
	.omit({
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

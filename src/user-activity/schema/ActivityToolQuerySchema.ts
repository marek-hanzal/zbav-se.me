import { z } from "zod";
import { ActivityQuerySchema } from "~/user-activity/schema/ActivityQuerySchema";
import { ActivityToolWhereSchema } from "~/user-activity/schema/ActivityToolWhereSchema";

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

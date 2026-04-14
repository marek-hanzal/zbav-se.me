import { z } from "zod";
import { ActivityFilterSchema } from "~/user/activity/server/schema/ActivityFilterSchema";

export const ActivityWhereSchema = z
	.looseObject({
		...ActivityFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "ActivityWhere",
		description: "App-level where filters",
	});

export type ActivityWhereSchema = typeof ActivityWhereSchema;

export namespace ActivityWhereSchema {
	export type Type = z.infer<ActivityWhereSchema>;
}

import { z } from "zod";
import { ActivityQuerySchema } from "./ActivityQuerySchema";

export const ActivityCountQuerySchema = z
	.looseObject({
		...ActivityQuerySchema.pick({
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "ActivityCountQuery",
		description: "Query object for activity count",
	});

export type ActivityCountQuerySchema = typeof ActivityCountQuerySchema;

export namespace ActivityCountQuerySchema {
	export type Type = z.infer<ActivityCountQuerySchema>;
}

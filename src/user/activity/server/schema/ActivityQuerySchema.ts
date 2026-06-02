import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { ActivitySortSchema } from "~/user/activity/server/schema/ActivitySortSchema";
import { ActivityWhereSchema } from "~/user/activity/server/schema/ActivityWhereSchema";

export const ActivityQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		where: ActivityWhereSchema.optional(),
		sort: ActivitySortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "ActivityQuery",
		description: "Query object for activity collection",
	});

export type ActivityQuerySchema = typeof ActivityQuerySchema;

export namespace ActivityQuerySchema {
	export type Type = z.infer<ActivityQuerySchema>;
}

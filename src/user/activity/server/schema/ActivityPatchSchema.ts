import { z } from "zod";
import { ActivityQuerySchema } from "~/user/activity/server/schema/ActivityQuerySchema";

export const ActivityPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				archivedAt: z.coerce.date().nullish().meta({
					description: "Archive timestamp",
					type: "string",
				}),
			})
			.strip(),
		query: ActivityQuerySchema,
	})
	.strip()
	.meta({
		id: "ActivityPatch",
		description: "Patch one activity item resolved by query",
	});

export type ActivityPatchSchema = typeof ActivityPatchSchema;

export namespace ActivityPatchSchema {
	export type Type = z.infer<ActivityPatchSchema>;
}

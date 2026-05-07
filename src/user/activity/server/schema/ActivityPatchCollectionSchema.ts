import { z } from "zod";
import { ActivityQuerySchema } from "~/user/activity/server/schema/ActivityQuerySchema";

export const ActivityPatchCollectionSchema = z
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
		id: "ActivityPatchCollection",
		description: "Patch activity items resolved by query",
	});

export type ActivityPatchCollectionSchema = typeof ActivityPatchCollectionSchema;

export namespace ActivityPatchCollectionSchema {
	export type Type = z.infer<ActivityPatchCollectionSchema>;
}

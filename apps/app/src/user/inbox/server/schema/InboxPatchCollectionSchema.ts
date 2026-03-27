import { z } from "zod";
import { InboxQuerySchema } from "~/user/inbox/server/schema/InboxQuerySchema";

export const InboxPatchCollectionSchema = z
	.looseObject({
		patch: z
			.looseObject({
				archivedAt: z.coerce.date().nullish().meta({
					description: "Archive timestamp",
					type: "string",
				}),
			})
			.strip(),
		query: InboxQuerySchema,
	})
	.strip()
	.meta({
		id: "InboxPatchCollection",
		description: "Patch inbox items resolved by query",
	});

export type InboxPatchCollectionSchema = typeof InboxPatchCollectionSchema;

export namespace InboxPatchCollectionSchema {
	export type Type = z.infer<InboxPatchCollectionSchema>;
}

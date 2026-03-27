import { z } from "zod";
import { InboxQuerySchema } from "~/server/@user/inbox/schema/InboxQuerySchema";

export const InboxPatchCollectionSchema = z
	.looseObject({
		patch: z
			.looseObject({
				archivedAt: z
					.union([
						z.null(),
						z.coerce.date(),
					])
					.optional()
					.meta({
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

import { z } from "zod";
import { InboxQuerySchema } from "~/server/@user/inbox/schema/InboxQuerySchema";

export const InboxPatchSchema = z
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
		id: "InboxPatch",
		description: "Patch one inbox item resolved by query",
	});

export type InboxPatchSchema = typeof InboxPatchSchema;

export namespace InboxPatchSchema {
	export type Type = z.infer<InboxPatchSchema>;
}

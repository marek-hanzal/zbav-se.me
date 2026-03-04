import { z } from "@hono/zod-openapi";
import { InboxQuerySchema } from "~/@user/inbox/schema/InboxQuerySchema";

export const InboxPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				archivedAt: z
					.union([
						z.null(),
						z.coerce.date(),
					])
					.optional()
					.openapi({
						description: "Archive timestamp",
						type: "string",
					}),
			})
			.strip(),
		query: InboxQuerySchema,
	})
	.strip()
	.openapi("InboxPatch", {
		description: "Patch one inbox item resolved by query",
	});

export type InboxPatchSchema = typeof InboxPatchSchema;

export namespace InboxPatchSchema {
	export type Type = z.infer<InboxPatchSchema>;
}

import { z } from "@hono/zod-openapi";
import { FeedDbSchema } from "~/app/feed/schema/FeedDbSchema";
import { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";

export const FeedPatchSchema = z
	.object({
		patch: z
			.object({
				...FeedDbSchema.shape,
			})
			.omit({
				userId: true,
				createdAt: true,
				updatedAt: true,
			})
			.partial()
			.openapi({
				description: "Fields to update (all optional)",
			}),
		query: FeedQuerySchema,
	})
	.openapi("FeedPatch", {
		description: "Data for updating an existing feed",
	});

export type FeedPatchSchema = typeof FeedPatchSchema;

export namespace FeedPatchSchema {
	export type Type = z.infer<FeedPatchSchema>;
}

import { z } from "@hono/zod-openapi";
import { FeedDbSchema } from "~/app/feed/schema/FeedDbSchema";
import { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";
import { ListingQuerySchema } from "~/app/listing/schema/ListingQuerySchema";

export const FeedPatchSchema = z
	.looseObject({
		patch: z
			.object({
				...FeedDbSchema.shape,
				query: ListingQuerySchema,
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
	.strip()
	.openapi("FeedPatch", {
		description: "Data for updating an existing feed",
	});

export type FeedPatchSchema = typeof FeedPatchSchema;

export namespace FeedPatchSchema {
	export type Type = z.infer<FeedPatchSchema>;
}

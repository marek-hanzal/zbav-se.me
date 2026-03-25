import { z } from "@hono/zod-openapi";
import { FeedQuerySchema } from "~/server/@buyer/feed/schema/FeedQuerySchema";
import { ListingQuerySchema } from "~/server/@buyer/listing/schema/ListingQuerySchema";
import { FeedTableSchema } from "~/server/database/@table/FeedTableSchema";

export const FeedPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...FeedTableSchema.shape,
				query: ListingQuerySchema,
			})
			.omit({
				userId: true,
				createdAt: true,
				updatedAt: true,
			})
			.partial()
			.strip()
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

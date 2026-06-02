import { z } from "zod";
import { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { FeedTableSchema } from "~/server/database/@table/FeedTableSchema";
import { ListingQuerySchema } from "./ListingQuerySchema";

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
			.meta({
				description: "Fields to update (all optional)",
			}),
		query: FeedQuerySchema,
	})
	.strip()
	.meta({
		id: "FeedPatch",
		description: "Data for updating an existing feed",
	});

export type FeedPatchSchema = typeof FeedPatchSchema;

export namespace FeedPatchSchema {
	export type Type = z.infer<FeedPatchSchema>;
}

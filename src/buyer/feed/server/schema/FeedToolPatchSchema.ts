import { z } from "zod";
import { FeedPatchSchema } from "~/buyer/feed/server/schema/FeedPatchSchema";
import { ListingToolQuerySchema } from "~/buyer/listing/server/schema/ListingToolQuerySchema";
import { FeedToolQuerySchema } from "./FeedToolQuerySchema";

export const FeedToolPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...FeedPatchSchema.shape.patch.shape,
				query: ListingToolQuerySchema,
			})
			.partial()
			.strip(),
		query: FeedToolQuerySchema.pick({
			filter: true,
		}),
	})
	.strip()
	.meta({
		id: "FeedToolPatch",
		description: "Data for updating an existing feed via tool",
	});

export type FeedToolPatchSchema = typeof FeedToolPatchSchema;

export namespace FeedToolPatchSchema {
	export type Type = z.infer<FeedToolPatchSchema>;
}

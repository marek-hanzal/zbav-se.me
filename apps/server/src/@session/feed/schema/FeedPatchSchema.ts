import { z } from "@hono/zod-openapi";
import { FeedQuerySchema } from "./FeedQuerySchema";

export const FeedPatchSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().min(1).optional().openapi({
			description: "Name of the feed",
		}),
		locationId: z.string().nullish().openapi({
			description: "ID of the location associated with the feed",
		}),
		query: z
			.union([
				FeedQuerySchema,
				z.null(),
			])
			.optional()
			.openapi({
				description: "Query configuration for the feed (listing)",
			}),
	})
	.openapi("FeedPatch", {
		description: "Data for updating an existing feed",
	});

export type FeedPatchSchema = typeof FeedPatchSchema;

export namespace FeedPatchSchema {
	export type Type = z.infer<FeedPatchSchema>;
}

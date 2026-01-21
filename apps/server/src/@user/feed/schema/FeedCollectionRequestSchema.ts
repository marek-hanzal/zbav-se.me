import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "~/app/listing/schema/ListingFilterSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const FeedCollectionRequestSchema = z
	.looseObject({
		feedId: z.string().openapi({
			description: "ID of the feed to collect listings for",
		}),
		where: ListingFilterSchema.optional(),
		cursor: CursorSchema.optional(),
	})
	.strip();

export type FeedCollectionRequestSchema = typeof FeedCollectionRequestSchema;

export namespace FeedCollectionRequestSchema {
	export type Type = z.infer<FeedCollectionRequestSchema>;
}

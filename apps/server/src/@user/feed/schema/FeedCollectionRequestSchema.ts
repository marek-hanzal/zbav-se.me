import { z } from "@hono/zod-openapi";
import { CursorSchema } from "../../../schema/CursorSchema";
import { ListingFilterSchema } from "../../listing/schema/ListingFilterSchema";

export const FeedCollectionRequestSchema = z.object({
	feedId: z.string().openapi({
		description: "ID of the feed to collect listings for",
	}),
	where: ListingFilterSchema.optional(),
	cursor: CursorSchema.optional(),
});

export type FeedCollectionRequestSchema = typeof FeedCollectionRequestSchema;

export namespace FeedCollectionRequestSchema {
	export type Type = z.infer<FeedCollectionRequestSchema>;
}

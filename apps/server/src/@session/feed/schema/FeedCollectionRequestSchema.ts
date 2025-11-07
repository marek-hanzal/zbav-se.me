import { z } from "@hono/zod-openapi";
import { CursorSchema } from "../../../schema/CursorSchema";
import { ListingFilterSchema } from "../../listing/schema/ListingFilterSchema";

export const FeedCollectionRequestSchema = z
	.object({
		feedId: z.string().openapi({
			description: "ID of the feed to collect listings for",
		}),
		where: ListingFilterSchema.optional().openapi({
			description: "Ability to override filters from the feed",
		}),
		cursor: CursorSchema.optional().openapi({
			description: "Pagination cursor",
		}),
	})
	.openapi("FeedCollectionRequest", {
		description: "Request to collect listings from a feed",
	});

export type FeedCollectionRequestSchema = typeof FeedCollectionRequestSchema;

export namespace FeedCollectionRequestSchema {
	export type Type = z.infer<FeedCollectionRequestSchema>;
}

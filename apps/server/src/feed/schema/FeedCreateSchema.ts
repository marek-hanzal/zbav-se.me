import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "../../listing/schema/ListingFilterSchema";

export const FeedCreateSchema = z
	.object({
		name: z.string().min(1).openapi({
			description: "Name of the feed",
		}),
		listing: ListingFilterSchema,
	})
	.openapi("FeedCreate");

export namespace FeedCreateSchema {
	export type Type = z.infer<typeof FeedCreateSchema>;
}

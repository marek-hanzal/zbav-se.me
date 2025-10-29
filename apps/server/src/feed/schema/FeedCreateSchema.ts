import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "../../listing/schema/ListingFilterSchema";
import { ListingSortSchema } from "../../listing/schema/ListingSortSchema";

export const FeedCreateSchema = z
	.object({
		name: z.string().min(1).openapi({
			description: "Name of the feed",
		}),
		filter: ListingFilterSchema,
		sort: ListingSortSchema.array(),
	})
	.openapi("FeedCreate");

export namespace FeedCreateSchema {
	export type Type = z.infer<typeof FeedCreateSchema>;
}

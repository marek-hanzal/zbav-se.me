import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "../../listing/schema/ListingFilterSchema";

export const FeedCreateSchema = z
	.object({
		listing: ListingFilterSchema,
	})
	.openapi("FeedCreate");

export namespace FeedCreateSchema {
	export type Type = z.infer<typeof FeedCreateSchema>;
}

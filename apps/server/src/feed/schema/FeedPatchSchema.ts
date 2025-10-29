import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "../../listing/schema/ListingFilterSchema";

export const FeedPatchSchema = z
	.object({
		id: z.string().min(1),
		listing: ListingFilterSchema,
	})
	.openapi("FeedPatch");

export type FeedPatchSchema = typeof FeedPatchSchema;

export namespace FeedPatchSchema {
	export type Type = z.infer<FeedPatchSchema>;
}

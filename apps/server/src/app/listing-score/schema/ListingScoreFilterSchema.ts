import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const ListingScoreFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().openapi({
			description: "This filter matches the exact listingId",
		}),
	})
	.openapi("ListingScoreFilter", {
		description: "Filter object for listing score collection",
	});

export type ListingScoreFilterSchema = typeof ListingScoreFilterSchema;

export namespace ListingScoreFilterSchema {
	export type Type = z.infer<ListingScoreFilterSchema>;
}

import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";

export const ListingScoreFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().nullish().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().nullish().openapi({
			description: "This filter matches the exact listingId",
		}),
	})
	.openapi("ListingScoreFilter", {
		description: "User-land filters",
	});

export type ListingScoreFilterSchema = typeof ListingScoreFilterSchema;

export namespace ListingScoreFilterSchema {
	export type Type = z.infer<ListingScoreFilterSchema>;
}

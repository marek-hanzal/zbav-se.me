import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";

export const ListingFlagFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().nullish().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().nullish().openapi({
			description: "This filter matches the exact listingId",
		}),
	})
	.openapi("ListingFlagFilter", {
		description: "User-land filters",
	});

export type ListingFlagFilterSchema = typeof ListingFlagFilterSchema;

export namespace ListingFlagFilterSchema {
	export type Type = z.infer<ListingFlagFilterSchema>;
}

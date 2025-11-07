import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";

export const ListingIgnoreFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().nullish().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().nullish().openapi({
			description: "This filter matches the exact listingId",
		}),
	})
	.openapi("ListingIgnoreFilter", {
		description: "User-land filters",
	});

export type ListingIgnoreFilterSchema = typeof ListingIgnoreFilterSchema;

export namespace ListingIgnoreFilterSchema {
	export type Type = z.infer<ListingIgnoreFilterSchema>;
}

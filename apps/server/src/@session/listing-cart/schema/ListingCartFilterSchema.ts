import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";

export const ListingCartFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().nullish().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().nullish().openapi({
			description: "This filter matches the exact listingId",
		}),
	})
	.openapi("ListingCartFilter", {
		description: "User-land filters",
	});

export type ListingCartFilterSchema = typeof ListingCartFilterSchema;

export namespace ListingCartFilterSchema {
	export type Type = z.infer<ListingCartFilterSchema>;
}

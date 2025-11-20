import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";

export const ListingIgnoreFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().openapi({
			description: "This filter matches the exact listingId",
		}),
	})
	.openapi("ListingIgnoreFilter", {
		description: "Filter object for listing ignore collection",
	});

export type ListingIgnoreFilterSchema = typeof ListingIgnoreFilterSchema;

export namespace ListingIgnoreFilterSchema {
	export type Type = z.infer<ListingIgnoreFilterSchema>;
}

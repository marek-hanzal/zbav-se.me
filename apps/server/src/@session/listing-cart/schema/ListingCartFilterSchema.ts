import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";

export const ListingCartFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().openapi({
			description: "This filter matches the exact listingId",
		}),
	})
	.openapi("ListingCartFilter", {
		description: "Filter object for listing cart collection",
	});

export type ListingCartFilterSchema = typeof ListingCartFilterSchema;

export namespace ListingCartFilterSchema {
	export type Type = z.infer<ListingCartFilterSchema>;
}

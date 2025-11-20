import { z } from "@hono/zod-openapi";
import { ListingCartDbSchema } from "../../../app/listing-cart/schema/ListingCartDbSchema";

export const ListingCartSchema = z
	.object({
		...ListingCartDbSchema.shape,
	})
	.omit({
		userId: true,
	})
	.openapi("ListingCart", {
		description: "Listing cart data",
	});

export type ListingCartSchema = typeof ListingCartSchema;

export namespace ListingCartSchema {
	export type Type = z.infer<ListingCartSchema>;
}

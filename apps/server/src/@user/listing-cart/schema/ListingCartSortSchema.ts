import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "../../../schema/OrderEnumSchema";

export const ListingCartSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("ListingCartSortField", {
				description: "Field of the listing cart sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("ListingCartSort", {
		description: "Sort object for listing cart collection",
	});

export type ListingCartSortSchema = typeof ListingCartSortSchema;

export namespace ListingCartSortSchema {
	export type Type = z.infer<ListingCartSortSchema>;
}

import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common/schema";

export const ListingCartSortSchema = z
	.object({
		value: z.enum([
			"createdAt",
		]),
		sort: OrderSchema,
	})
	.openapi("ListingCartSort", {
		description: "Sort object for listing cart collection",
	});

export type ListingCartSortSchema = typeof ListingCartSortSchema;

export namespace ListingCartSortSchema {
	export type Type = z.infer<ListingCartSortSchema>;
}

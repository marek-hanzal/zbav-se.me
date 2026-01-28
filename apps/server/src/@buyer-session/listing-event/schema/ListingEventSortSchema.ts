import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const ListingEventSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("ListingEventSortField", {
				description: "Field of the listing event sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("ListingEventSort", {
		description: "Sort object for listing event collection",
	});

export type ListingEventSortSchema = typeof ListingEventSortSchema;

export namespace ListingEventSortSchema {
	export type Type = z.infer<ListingEventSortSchema>;
}

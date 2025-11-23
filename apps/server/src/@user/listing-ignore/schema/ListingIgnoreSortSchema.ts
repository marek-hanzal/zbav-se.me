import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "../../../schema/OrderEnumSchema";

export const ListingIgnoreSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("ListingIgnoreSortField", {
				description: "Field of the listing ignore sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("ListingIgnoreSort", {
		description: "Sort object for listing ignore collection",
	});

export type ListingIgnoreSortSchema = typeof ListingIgnoreSortSchema;

export namespace ListingIgnoreSortSchema {
	export type Type = z.infer<ListingIgnoreSortSchema>;
}

import { z } from "@hono/zod-openapi";
import { OrderSchema } from "../../../schema/OrderSchema";

export const ListingIgnoreSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("ListingIgnoreSortField", {
				description: "Field of the listing ignore sort",
			}),
		direction: OrderSchema,
	})
	.openapi("ListingIgnoreSort", {
		description: "Sort object for listing ignore collection",
	});

export type ListingIgnoreSortSchema = typeof ListingIgnoreSortSchema;

export namespace ListingIgnoreSortSchema {
	export type Type = z.infer<ListingIgnoreSortSchema>;
}

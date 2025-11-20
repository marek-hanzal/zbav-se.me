import { z } from "@hono/zod-openapi";
import { OrderSchema } from "../../../schema/OrderSchema";

export const ListingFlagSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("ListingFlagSortField", {
				description: "Field of the listing flag sort",
			}),
		direction: OrderSchema,
	})
	.openapi("ListingFlagSort", {
		description: "Sort object for listing flag collection",
	});

export type ListingFlagSortSchema = typeof ListingFlagSortSchema;

export namespace ListingFlagSortSchema {
	export type Type = z.infer<ListingFlagSortSchema>;
}

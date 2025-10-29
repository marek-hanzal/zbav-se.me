import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";

export const ListingCommonSortSchema = z
	.object({
		type: z.literal("listing").openapi({
			description: "Common listing sort keys",
		}),
		value: z.enum([
			"price",
			"condition",
			"age",
			"createdAt",
			"updatedAt",
			"expiresAt",
		]),
		sort: OrderSchema,
	})
	.nullish()
	.openapi("ListingCommonSort", {
		description: "Common listing sort keys",
	});

export type ListingCommonSortSchema = typeof ListingCommonSortSchema;

export namespace ListingCommonSortSchema {
	export type Type = z.infer<ListingCommonSortSchema>;
}

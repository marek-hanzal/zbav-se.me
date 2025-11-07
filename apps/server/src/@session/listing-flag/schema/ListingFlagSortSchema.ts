import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common/schema";

export const ListingFlagSortSchema = z
	.object({
		value: z.enum([
			"createdAt",
		]),
		sort: OrderSchema,
	})
	.openapi("ListingFlagSort", {
		description: "Sort object for listing flag collection",
	});

export type ListingFlagSortSchema = typeof ListingFlagSortSchema;

export namespace ListingFlagSortSchema {
	export type Type = z.infer<ListingFlagSortSchema>;
}

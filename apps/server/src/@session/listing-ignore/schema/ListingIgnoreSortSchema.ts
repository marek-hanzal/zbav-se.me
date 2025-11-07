import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common/schema";

export const ListingIgnoreSortSchema = z
	.object({
		value: z.enum([
			"createdAt",
		]),
		sort: OrderSchema,
	})
	.openapi("ListingIgnoreSort", {
		description: "Sort object for listing ignore collection",
	});

export type ListingIgnoreSortSchema = typeof ListingIgnoreSortSchema;

export namespace ListingIgnoreSortSchema {
	export type Type = z.infer<ListingIgnoreSortSchema>;
}

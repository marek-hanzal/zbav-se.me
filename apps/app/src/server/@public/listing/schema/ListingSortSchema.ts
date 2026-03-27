import { OrderEnumSchema } from "@use-pico/common/schema";
import { z } from "zod";

export const ListingSortSchema = z
	.looseObject({
		field: z
			.enum([
				"price",
				"condition",
				"age",
				"createdAt",
				"updatedAt",
				"expiresAt",
				"geo",
			])
			.meta({
				id: "PublicListingSortField",
				description: "Field of the listing sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "PublicListingSort",
		description: "Sort object for public listing collection",
	});

export type ListingSortSchema = typeof ListingSortSchema;

export namespace ListingSortSchema {
	export type Type = z.infer<ListingSortSchema>;
}

import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const ListingSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
				"updatedAt",
				"expiresAt",
				//
				"withLastAt",
			])
			.meta({
				id: "ListingSortField",
				description: "Field of the listing sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "ListingSort",
		description: "Sort object for listing collection",
	});

export type ListingSortSchema = typeof ListingSortSchema;

export namespace ListingSortSchema {
	export type Type = z.infer<ListingSortSchema>;
}

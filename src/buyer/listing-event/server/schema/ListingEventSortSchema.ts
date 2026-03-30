import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const ListingEventSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.meta({
				id: "ListingEventSortField",
				description: "Field of the listing event sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "ListingEventSort",
		description: "Sort object for listing event collection",
	});

export type ListingEventSortSchema = typeof ListingEventSortSchema;

export namespace ListingEventSortSchema {
	export type Type = z.infer<ListingEventSortSchema>;
}

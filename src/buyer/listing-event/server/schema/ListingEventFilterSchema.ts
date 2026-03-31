import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const ListingEventFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		listingId: z.string().optional().meta({
			description: "This filter matches the exact listingId",
		}),
	})
	.strip()
	.meta({
		id: "ListingEventFilter",
		description: "Filter object for listing event collection",
	});

export type ListingEventFilterSchema = typeof ListingEventFilterSchema;

export namespace ListingEventFilterSchema {
	export type Type = z.infer<ListingEventFilterSchema>;
}

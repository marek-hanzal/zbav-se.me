import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const ListingEventWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		listingId: z.string().optional().meta({
			description: "This filter matches the exact listingId",
		}),
	})
	.strip()
	.meta({
		id: "ListingEventWhere",
		description: "App-based filters",
	});

export type ListingEventWhereSchema = typeof ListingEventWhereSchema;

export namespace ListingEventWhereSchema {
	export type Type = z.infer<ListingEventWhereSchema>;
}

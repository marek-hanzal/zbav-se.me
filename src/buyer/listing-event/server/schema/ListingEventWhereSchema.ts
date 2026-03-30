import { z } from "zod";
import { ListingEventFilterSchema } from "~/buyer/listing-event/server/schema/ListingEventFilterSchema";

export const ListingEventWhereSchema = z
	.looseObject({
		...ListingEventFilterSchema.shape,
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

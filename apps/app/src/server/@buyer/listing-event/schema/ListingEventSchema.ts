import { z } from "zod";
import { ListingEventTableSchema } from "~/server/database/@table/ListingEventTableSchema";

export const ListingEventSchema = z
	.looseObject({
		...ListingEventTableSchema.shape,
	})
	.strip()
	.meta({
		id: "ListingEvent",
		description: "Listing event data",
	});

export type ListingEventSchema = typeof ListingEventSchema;

export namespace ListingEventSchema {
	export type Type = z.infer<ListingEventSchema>;
}

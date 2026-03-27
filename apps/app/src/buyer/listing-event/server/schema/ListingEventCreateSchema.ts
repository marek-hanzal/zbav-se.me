import { z } from "zod";
import { ListingEventEnumSchema } from "~/common/listing/enum/ListingEventEnumSchema";

export const ListingEventCreateSchema = z
	.looseObject({
		listingId: z.string().meta({
			description: "ID of the listing",
		}),
		event: ListingEventEnumSchema,
	})
	.strip()
	.meta({
		id: "ListingEventCreate",
		description: "Data for creating a new listing event",
	});

export type ListingEventCreateSchema = typeof ListingEventCreateSchema;

export namespace ListingEventCreateSchema {
	export type Type = z.infer<ListingEventCreateSchema>;
}

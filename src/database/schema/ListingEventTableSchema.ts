import { z } from "zod";
import { ListingEventEnumSchema } from "~/listing/schema/ListingEventEnumSchema";

export const ListingEventTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the event",
		}),
		listingId: z.string().meta({
			description: "ID of the listing",
		}),
		event: ListingEventEnumSchema,
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "ListingEventTable",
		description: "Database row for a listing event.",
	})
	.strip();

export type ListingEventTableSchema = typeof ListingEventTableSchema;

export namespace ListingEventTableSchema {
	export type Type = z.infer<ListingEventTableSchema>;
}

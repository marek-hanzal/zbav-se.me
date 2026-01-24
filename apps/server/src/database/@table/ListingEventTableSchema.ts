import { z } from "@hono/zod-openapi";
import { ListingEventEnumSchema } from "~/@session/listing-event/schema/ListingEventEnumSchema";

export const ListingEventTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the event",
	}),
	listingId: z.string().openapi({
		description: "ID of the listing",
	}),
	event: ListingEventEnumSchema,
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type ListingEventTableSchema = typeof ListingEventTableSchema;

export namespace ListingEventTableSchema {
	export type Type = z.infer<ListingEventTableSchema>;
}

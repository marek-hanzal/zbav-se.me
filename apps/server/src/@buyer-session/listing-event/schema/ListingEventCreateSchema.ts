import { z } from "@hono/zod-openapi";
import { ListingEventEnumSchema } from "~/@buyer-session/listing-event/schema/ListingEventEnumSchema";

export const ListingEventCreateSchema = z
	.looseObject({
		listingId: z.string().openapi({
			description: "ID of the listing",
		}),
		event: ListingEventEnumSchema,
	})
	.strip()
	.openapi("ListingEventCreate", {
		description: "Data for creating a new listing event",
	});

export type ListingEventCreateSchema = typeof ListingEventCreateSchema;

export namespace ListingEventCreateSchema {
	export type Type = z.infer<ListingEventCreateSchema>;
}

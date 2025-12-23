import { z } from "@hono/zod-openapi";
import { ListingEventEnumSchema } from "./ListingEventEnumSchema";

export const ListingEventDbSchema = z.object({
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

export type ListingEventDbSchema = typeof ListingEventDbSchema;

export namespace ListingEventDbSchema {
	export type Type = z.infer<ListingEventDbSchema>;
}

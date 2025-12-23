import { z } from "@hono/zod-openapi";
import { ListingEventDbSchema } from "~/app/listing-event/schema/ListingEventDbSchema";

export const ListingEventSchema = z
	.object({
		...ListingEventDbSchema.shape,
	})
	.openapi("ListingEvent", {
		description: "Listing event data",
	});

export type ListingEventSchema = typeof ListingEventSchema;

export namespace ListingEventSchema {
	export type Type = z.infer<ListingEventSchema>;
}

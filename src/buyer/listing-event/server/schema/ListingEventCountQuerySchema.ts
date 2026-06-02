import { z } from "zod";
import { ListingEventQuerySchema } from "~/buyer/listing-event/server/schema/ListingEventQuerySchema";

export const ListingEventCountQuerySchema = z
	.looseObject({
		...ListingEventQuerySchema.pick({
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "ListingEventCountQuery",
		description: "Query object for listing event count",
	});

export type ListingEventCountQuerySchema = typeof ListingEventCountQuerySchema;

export namespace ListingEventCountQuerySchema {
	export type Type = z.infer<ListingEventCountQuerySchema>;
}

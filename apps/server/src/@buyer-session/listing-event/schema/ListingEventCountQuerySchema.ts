import { z } from "@hono/zod-openapi";
import { ListingEventQuerySchema } from "~/@buyer-session/listing-event/schema/ListingEventQuerySchema";

export const ListingEventCountQuerySchema = z
	.looseObject({
		...ListingEventQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.openapi("ListingEventCountQuery", {
		description: "Query object for listing event count",
	});

export type ListingEventCountQuerySchema = typeof ListingEventCountQuerySchema;

export namespace ListingEventCountQuerySchema {
	export type Type = z.infer<ListingEventCountQuerySchema>;
}

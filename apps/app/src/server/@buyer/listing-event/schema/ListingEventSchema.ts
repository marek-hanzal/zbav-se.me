import { z } from "@hono/zod-openapi";
import { ListingEventTableSchema } from "~/server/database/@table/ListingEventTableSchema";

export const ListingEventSchema = z
	.looseObject({
		...ListingEventTableSchema.shape,
	})
	.strip()
	.openapi("ListingEvent", {
		description: "Listing event data",
	});

export type ListingEventSchema = typeof ListingEventSchema;

export namespace ListingEventSchema {
	export type Type = z.infer<ListingEventSchema>;
}

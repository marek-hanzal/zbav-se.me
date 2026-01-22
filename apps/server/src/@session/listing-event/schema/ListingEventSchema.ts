import { z } from "@hono/zod-openapi";
import { ListingEventDbSchema } from "./ListingEventDbSchema";

export const ListingEventSchema = z
	.looseObject({
		...ListingEventDbSchema.shape,
	})
	.strip()
	.openapi("ListingEvent", {
		description: "Listing event data",
	});

export type ListingEventSchema = typeof ListingEventSchema;

export namespace ListingEventSchema {
	export type Type = z.infer<ListingEventSchema>;
}

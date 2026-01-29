import { z } from "@hono/zod-openapi";
import { ListingEventFilterSchema } from "~/@buyer-session/listing-event/schema/ListingEventFilterSchema";

export const ListingEventWhereSchema = z
	.object({
		...ListingEventFilterSchema.shape,
	})
	.openapi("ListingEventWhere", {
		description: "App-based filters",
	});

export type ListingEventWhereSchema = typeof ListingEventWhereSchema;

export namespace ListingEventWhereSchema {
	export type Type = z.infer<ListingEventWhereSchema>;
}

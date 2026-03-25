import { z } from "@hono/zod-openapi";
import { ListingEventFilterSchema } from "~/server/@buyer/listing-event/schema/ListingEventFilterSchema";

export const ListingEventWhereSchema = z
	.looseObject({
		...ListingEventFilterSchema.shape,
	})
	.strip()
	.openapi("ListingEventWhere", {
		description: "App-based filters",
	});

export type ListingEventWhereSchema = typeof ListingEventWhereSchema;

export namespace ListingEventWhereSchema {
	export type Type = z.infer<ListingEventWhereSchema>;
}

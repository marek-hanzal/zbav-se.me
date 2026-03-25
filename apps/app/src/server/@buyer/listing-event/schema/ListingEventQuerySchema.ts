import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/common/schema/CursorSchema";
import { ListingEventFilterSchema } from "~/server/@buyer/listing-event/schema/ListingEventFilterSchema";
import { ListingEventSortSchema } from "~/server/@buyer/listing-event/schema/ListingEventSortSchema";
import { ListingEventWhereSchema } from "~/server/@buyer/listing-event/schema/ListingEventWhereSchema";

export const ListingEventQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: ListingEventFilterSchema.optional(),
		where: ListingEventWhereSchema.optional(),
		sort: ListingEventSortSchema.array().optional(),
	})
	.strip()
	.openapi("ListingEventQuery", {
		description: "Query object for listing event collection",
	});

export type ListingEventQuerySchema = typeof ListingEventQuerySchema;

export namespace ListingEventQuerySchema {
	export type Type = z.infer<ListingEventQuerySchema>;
}

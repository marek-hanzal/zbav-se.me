import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { ListingEventFilterSchema } from "~/buyer/listing-event/server/schema/ListingEventFilterSchema";
import { ListingEventSortSchema } from "~/buyer/listing-event/server/schema/ListingEventSortSchema";
import { ListingEventWhereSchema } from "~/buyer/listing-event/server/schema/ListingEventWhereSchema";

export const ListingEventQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: ListingEventFilterSchema.optional(),
		where: ListingEventWhereSchema.optional(),
		sort: ListingEventSortSchema.array().optional(),
	})
	.strip()
	.meta({
		id: "ListingEventQuery",
		description: "Query object for listing event collection",
	});

export type ListingEventQuerySchema = typeof ListingEventQuerySchema;

export namespace ListingEventQuerySchema {
	export type Type = z.infer<ListingEventQuerySchema>;
}

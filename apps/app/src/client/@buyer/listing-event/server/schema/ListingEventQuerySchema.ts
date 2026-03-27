import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { ListingEventFilterSchema } from "~/client/@buyer/listing-event/server/schema/ListingEventFilterSchema";
import { ListingEventSortSchema } from "~/client/@buyer/listing-event/server/schema/ListingEventSortSchema";
import { ListingEventWhereSchema } from "~/client/@buyer/listing-event/server/schema/ListingEventWhereSchema";

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

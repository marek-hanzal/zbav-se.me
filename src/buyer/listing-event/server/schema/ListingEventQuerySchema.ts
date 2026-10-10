import { z } from "zod";
import { ListingEventSortSchema } from "~/buyer/listing-event/server/schema/ListingEventSortSchema";
import { ListingEventWhereSchema } from "~/buyer/listing-event/server/schema/ListingEventWhereSchema";
import { CursorSchema } from "~/query/schema/CursorSchema";

export const ListingEventQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		where: ListingEventWhereSchema.optional(),
		sort: ListingEventSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
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

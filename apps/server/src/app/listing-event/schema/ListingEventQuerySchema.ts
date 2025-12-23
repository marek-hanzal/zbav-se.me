import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { ListingEventFilterSchema } from "./ListingEventFilterSchema";
import { ListingEventSortSchema } from "./ListingEventSortSchema";

export const ListingEventQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingEventFilterSchema.optional(),
		where: ListingEventFilterSchema.openapi("ListingEventWhere", {
			description: "App-based filters",
		}).optional(),
		sort: ListingEventSortSchema.array().optional(),
	})
	.openapi("ListingEventQuery", {
		description: "Query object for listing event collection",
	});

export type ListingEventQuerySchema = typeof ListingEventQuerySchema;

export namespace ListingEventQuerySchema {
	export type Type = z.infer<ListingEventQuerySchema>;
}

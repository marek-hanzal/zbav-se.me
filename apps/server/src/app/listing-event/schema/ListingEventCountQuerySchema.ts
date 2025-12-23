import type { z } from "@hono/zod-openapi";
import { ListingEventQuerySchema } from "./ListingEventQuerySchema";

export const ListingEventCountQuerySchema = ListingEventQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("ListingEventCountQuery", {
	description: "Query object for listing event count",
});

export type ListingEventCountQuerySchema = typeof ListingEventCountQuerySchema;

export namespace ListingEventCountQuerySchema {
	export type Type = z.infer<ListingEventCountQuerySchema>;
}

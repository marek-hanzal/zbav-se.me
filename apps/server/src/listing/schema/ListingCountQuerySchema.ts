import type { z } from "@hono/zod-openapi";
import { ListingQuerySchema } from "./ListingQuerySchema";

export const ListingCountQuerySchema = ListingQuerySchema.pick({
	filter: true,
	where: true,
	meta: true,
}).openapi("ListingCountQuery", {
	description:
		"Query object for listing count (omits cursor, sort, and meta)",
});

export type ListingCountQuerySchema = typeof ListingCountQuerySchema;

export namespace ListingCountQuerySchema {
	export type Type = z.infer<ListingCountQuerySchema>;
}

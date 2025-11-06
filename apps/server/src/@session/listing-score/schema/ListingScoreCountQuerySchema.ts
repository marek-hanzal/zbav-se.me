import type { z } from "@hono/zod-openapi";
import { ListingScoreQuerySchema } from "./ListingScoreQuerySchema";

export const ListingScoreCountQuerySchema = ListingScoreQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("ListingScoreCountQuery", {
	description:
		"Query object for listing score count (omits cursor, sort, and meta)",
});

export type ListingScoreCountQuerySchema = typeof ListingScoreCountQuerySchema;

export namespace ListingScoreCountQuerySchema {
	export type Type = z.infer<ListingScoreCountQuerySchema>;
}
